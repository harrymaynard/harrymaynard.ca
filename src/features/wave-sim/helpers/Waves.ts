import * as Common from './Common'
import * as Simulation from './Simulation'

const main = function () {
    const simulatorCanvas = document.getElementById(Common.SIMULATOR_CANVAS_ID),
        overlayDiv = document.getElementById(Common.OVERLAY_DIV_ID),
        uiDiv = document.getElementById(Common.UI_DIV_ID),
        cameraDiv = document.getElementById(Common.CAMERA_DIV_ID),
        windDiv = document.getElementById(Common.WIND_SPEED_DIV_ID),
        windSpeedSpan = document.getElementById(Common.WIND_SPEED_SPAN_ID),
        choppinessDiv = document.getElementById(Common.CHOPPINESS_DIV_ID),
        sizeSpan = document.getElementById('size-value');

    Common.setText(choppinessDiv, Common.INITIAL_CHOPPINESS, Common.CHOPPINESS_DECIMAL_PLACES);
    Common.setText(sizeSpan, Common.INITIAL_SIZE, Common.SIZE_DECIMAL_PLACES);

    const camera = new Simulation.Camera(),
        projectionMatrix = Common.makePerspectiveMatrix(new Float32Array(16), Common.FOV, Common.MIN_ASPECT, Common.NEAR, Common.FAR);
    
    const simulator = new Common.Simulator(simulatorCanvas, window.innerWidth, window.innerHeight);

    const profile = new Common.Profile(document.getElementById(Common.PROFILE_CANVAS_ID)),
        sizeSlider = new Common.Slider(cameraDiv, Common.SIZE_SLIDER_X, Common.SIZE_SLIDER_Z,
            Common.SIZE_SLIDER_LENGTH, Common.MIN_SIZE, Common.MAX_SIZE, Common.INITIAL_SIZE, Common.SIZE_SLIDER_BREADTH, Common.SIZE_HANDLE_SIZE),
        choppinessSlider = new Common.Slider(cameraDiv, Common.CHOPPINESS_SLIDER_X, Common.CHOPPINESS_SLIDER_Z,
            Common.CHOPPINESS_SLIDER_LENGTH, Common.MIN_CHOPPINESS, Common.MAX_CHOPPINESS, Common.INITIAL_CHOPPINESS, Common.CHOPPINESS_SLIDER_BREADTH, Common.CHOPPINESS_HANDLE_SIZE);

    let width = window.innerWidth,
        height = window.innerHeight;

    let lastMouseX = 0;
    let lastMouseY = 0;
    let mode = Common.NONE;

    const setUIPerspective = function (height) {
        const fovValue = 0.5 / Math.tan(Common.FOV / 2) * height;
        Common.setPerspective(uiDiv, fovValue + 'px');
    };

    const windArrow = new Common.Arrow(cameraDiv, Common.INITIAL_WIND[0], Common.INITIAL_WIND[1]);
    Common.setText(windSpeedSpan, windArrow.getValue(), Common.WIND_SPEED_DECIMAL_PLACES);
    Common.setTransform(windDiv, 'translate3d(' + Common.WIND_SPEED_X + 'px, 0px, ' + Math.max(Common.MIN_WIND_SPEED_Z, windArrow.getTipZ() + Common.WIND_SPEED_OFFSET) + 'px) rotateX(90deg)');

    const inverseProjectionViewMatrix = [],
        nearPoint = [],
        farPoint = [];
    const unproject = function (viewMatrix, x, y, width, height) {
        premultiplyMatrix(inverseProjectionViewMatrix, viewMatrix, projectionMatrix);
        invertMatrix(inverseProjectionViewMatrix, inverseProjectionViewMatrix);

        setVector4(nearPoint, (x / width) * 2.0 - 1.0, ((height - y) / height) * 2.0 - 1.0, 1.0, 1.0);
        transformVectorByMatrix(nearPoint, nearPoint, inverseProjectionViewMatrix);

        setVector4(farPoint, (x / width) * 2.0 - 1.0, ((height - y) / height) * 2.0 - 1.0, -1.0, 1.0);
        transformVectorByMatrix(farPoint, farPoint, inverseProjectionViewMatrix);

        projectVector4(nearPoint, nearPoint);
        projectVector4(farPoint, farPoint);

        const t = -nearPoint[1] / (farPoint[1] - nearPoint[1]);
        const point = [
            nearPoint[0] + t * (farPoint[0] - nearPoint[0]),
            nearPoint[1] + t * (farPoint[1] - nearPoint[1]),
            nearPoint[2] + t * (farPoint[2] - nearPoint[2]),
        ];

        return point;
    };

    const onMouseDown = function (event) {
        event.preventDefault();

        const mousePosition = getMousePosition(event, uiDiv);
        const mouseX = mousePosition.x,
            mouseY = mousePosition.y;

        const point = unproject(camera.getViewMatrix(), mouseX, mouseY, width, height);

        if (windArrow.distanceToTip(point) < ARROW_TIP_RADIUS) {
            mode = Common.ROTATING;
        } else if (sizeSlider.distanceToHandle(point) < SIZE_HANDLE_RADIUS) {
            mode = Common.SLIDING_SIZE;
        } else if (choppinessSlider.distanceToHandle(point) < CHOPPINESS_HANDLE_RADIUS) {
            mode = Common.SLIDING_CHOPPINESS;
        } else {
            mode = Common.ORBITING;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    };
    overlayDiv.addEventListener('mousedown', onMouseDown, false);

    overlayDiv.addEventListener('mousemove', function (event) {
        event.preventDefault();

        const mousePosition = getMousePosition(event, uiDiv),
            mouseX = mousePosition.x,
            mouseY = mousePosition.y;

        const point = unproject(camera.getViewMatrix(), mouseX, mouseY, width, height);

        if (windArrow.distanceToTip(point) < ARROW_TIP_RADIUS || mode === Common.ROTATING) {
            overlayDiv.style.cursor = 'move';
        } else if (sizeSlider.distanceToHandle(point) < SIZE_HANDLE_RADIUS || 
            choppinessSlider.distanceToHandle(point) < CHOPPINESS_HANDLE_RADIUS || 
            mode === Common.SLIDING_SIZE || mode === Common.SLIDING_CHOPPINESS) {
            overlayDiv.style.cursor = 'ew-resize';
        } else if (mode === Common.ORBITING) {
            overlayDiv.style.cursor = '-webkit-grabbing';
            overlayDiv.style.cursor = '-moz-grabbing';
            overlayDiv.style.cursor = 'grabbing';
        } else {
            overlayDiv.style.cursor = '-webkit-grab';
            overlayDiv.style.cursor = '-moz-grab';
            overlayDiv.style.cursor = 'grab';
        }

        if (mode === Common.ORBITING) {
            camera.changeAzimuth((mouseX - lastMouseX) / width * SENSITIVITY);
            camera.changeElevation((mouseY - lastMouseY) / height * SENSITIVITY);
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        } else if (mode === Common.ROTATING) {
            windArrow.update(point[0], point[2]);
            simulator.setWind(windArrow.getValueX(), windArrow.getValueY());
            setText(windSpeedSpan, windArrow.getValue(), WIND_SPEED_DECIMAL_PLACES);

            setTransform(windDiv, 'translate3d(' + WIND_SPEED_X + 'px, 0px, ' + Math.max(MIN_WIND_SPEED_Z, windArrow.getTipZ() + WIND_SPEED_OFFSET) + 'px) rotateX(90deg)');
        } else if (mode === Common.SLIDING_SIZE) {
            sizeSlider.update(point[0], function (size) {
                simulator.setSize(size);
                setText(sizeSpan, size, SIZE_DECIMAL_PLACES);
            });
        } else if (mode === Common.SLIDING_CHOPPINESS) {
            choppinessSlider.update(point[0], function (choppiness) {
                simulator.setChoppiness(choppiness);
                setText(choppinessDiv, choppiness, CHOPPINESS_DECIMAL_PLACES);
                profile.render(choppiness);
            });
        }
    });

    overlayDiv.addEventListener('mouseup', function (event) {
        event.preventDefault();
        mode = Common.NONE;
    });

    window.addEventListener('mouseout', function (event) {
        const from = event.relatedTarget || event.toElement;
        if (!from || from.nodeName === 'HTML') {
            mode = Common.NONE;
        }
    });

    const onresize = function () {
        const windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;

        overlayDiv.style.width = windowWidth + 'px';
        overlayDiv.style.height = windowHeight + 'px';

        if (windowWidth / windowHeight > MIN_ASPECT) {
            makePerspectiveMatrix(projectionMatrix, FOV, windowWidth / windowHeight, NEAR, FAR);
            simulator.resize(windowWidth, windowHeight);
            uiDiv.style.width = windowWidth + 'px';
            uiDiv.style.height = windowHeight + 'px';
            cameraDiv.style.width = windowWidth + 'px';
            cameraDiv.style.height = windowHeight + 'px';
            simulatorCanvas.style.top = '0px';
            uiDiv.style.top = '0px';
            setUIPerspective(windowHeight);
            width = windowWidth;
            height = windowHeight;
        } else {
            const newHeight = windowWidth / MIN_ASPECT;
            makePerspectiveMatrix(projectionMatrix, FOV, windowWidth / newHeight, NEAR, FAR);
            simulator.resize(windowWidth, newHeight);
            simulatorCanvas.style.top = (windowHeight - newHeight) * 0.5 + 'px';
            uiDiv.style.top = (windowHeight - newHeight) * 0.5 + 'px';
            setUIPerspective(newHeight);
            uiDiv.style.width = windowWidth + 'px';
            uiDiv.style.height = newHeight + 'px';
            cameraDiv.style.width = windowWidth + 'px';
            cameraDiv.style.height = newHeight + 'px';
            width = windowWidth;
            height = newHeight;
        }
    };

    window.addEventListener('resize', onresize);
    onresize();

    let lastTime = (new Date()).getTime();
    const render = function render (currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000 || 0.0;
        lastTime = currentTime;

        const fovValue = 0.5 / Math.tan(FOV / 2) * height;
        setTransform(cameraDiv, 'translate3d(0px, 0px, ' + fovValue + 'px) ' + toCSSMatrix(camera.getViewMatrix()) + ' translate3d(' + width / 2 + 'px, ' + height / 2 + 'px, 0px)');
        simulator.render(deltaTime, projectionMatrix, camera.getViewMatrix(), camera.getPosition());

        requestAnimationFrame(render);
    };
    render();
};

if (hasWebGLSupportWithExtensions(['OES_texture_float', 'OES_texture_float_linear'])) {
    main();
} else {
    document.getElementById('error').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
}

// You can still view this on <a href="http://youtu.be/IrUehq6vJss">YouTube. If you cannot access the link. Then too bad, I can't help you with that. Get a new gadget.</a>.

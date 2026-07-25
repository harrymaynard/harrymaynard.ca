import * as Common from './Common'

//waves in simulation are not actually Gerstner waves but Gerstner waves are used for visualisation purposes
export const Profile = function (canvas) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    context.strokeStyle = Common.PROFILE_COLOR;
    context.lineWidth = Common.PROFILE_LINE_WIDTH;

    const evaluateX = function (x, choppiness) {
        return x - choppiness * Common.CHOPPINESS_SCALE * Common.PROFILE_AMPLITUDE * Math.sin(x * Common.PROFILE_OMEGA + Common.PROFILE_PHI);
    };

    const evaluateY = function (x) {
        return Common.PROFILE_AMPLITUDE * Math.cos(x * Common.PROFILE_OMEGA + Common.PROFILE_PHI) + Common.PROFILE_OFFSET;
    };

    this.render = function (choppiness) {
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.moveTo(evaluateX(0, choppiness), evaluateY(0));
        for (let x = 0; x <= width; x += Common.PROFILE_STEP) {
            context.lineTo(evaluateX(x, choppiness), evaluateY(x)
            );
        }
        context.stroke();
    };
    this.render(Common.INITIAL_CHOPPINESS);
};

export const Arrow = function (parent, valueX, valueY) {
    const arrow = [valueX * Common.WIND_SCALE, 0.0, valueY * Common.WIND_SCALE];
    const tip = Common.addToVector([], Common.ARROW_ORIGIN, arrow);

    const shaftDiv = document.createElement('div');
    shaftDiv.style.position = 'absolute';
    shaftDiv.style.width = Common.ARROW_SHAFT_WIDTH + 'px';
    shaftDiv.style.background = Common.UI_COLOR;
    Common.setTransformOrigin(shaftDiv, 'center top');
    Common.setTransform(shaftDiv, 'translate3d(' + (Common.ARROW_ORIGIN[0] - Common.ARROW_SHAFT_WIDTH / 2) + 'px, ' + Common.ARROW_ORIGIN[1] + 'px, ' + Common.ARROW_ORIGIN[2] + 'px) rotateX(90deg)');
    parent.appendChild(shaftDiv);

    const headDiv = document.createElement('div');
    headDiv.style.position = 'absolute';
    headDiv.style.borderStyle = 'solid';
    headDiv.style.borderColor = Common.UI_COLOR + ' transparent transparent transparent';
    headDiv.style.borderWidth = Common.ARROW_HEAD_HEIGHT + 'px ' + Common.ARROW_HEAD_WIDTH / 2 + 'px 0px ' + Common.ARROW_HEAD_WIDTH / 2 + 'px';
    Common.setTransformOrigin(headDiv, 'center top');
    Common.setTransform(headDiv, 'translate3d(' + (Common.ARROW_ORIGIN[0] - Common.ARROW_HEAD_WIDTH / 2) + 'px, ' + Common.ARROW_ORIGIN[1] + 'px, ' + Common.ARROW_ORIGIN[2] + 'px) rotateX(90deg)');
    parent.appendChild(headDiv);

    const render = function () {
        const angle = Math.atan2(arrow[2], arrow[0]);

        const arrowLength = Common.lengthOfVector(arrow);

        shaftDiv.style.height = (arrowLength - Common.ARROW_HEAD_HEIGHT + 1 + Common.ARROW_OFFSET) + 'px';
        Common.setTransform(shaftDiv, 'translate3d(' + (Common.ARROW_ORIGIN[0] - Common.ARROW_SHAFT_WIDTH / 2) + 'px, ' + Common.ARROW_ORIGIN[1] + 'px, ' + Common.ARROW_ORIGIN[2] + 'px) rotateX(90deg) rotateZ(' + (angle - Math.PI / 2) + 'rad) translateY(' + -Common.ARROW_OFFSET + 'px)');
        Common.setTransform(headDiv, 'translate3d(' + (Common.ARROW_ORIGIN[0] - Common.ARROW_HEAD_WIDTH / 2) + 'px, ' + Common.ARROW_ORIGIN[1] + 'px, ' + Common.ARROW_ORIGIN[2] + 'px) rotateX(90deg) rotateZ(' + (angle - Math.PI / 2) + 'rad) translateY(' + (arrowLength - Common.ARROW_HEAD_HEIGHT - 1) + 'px)');
    };

    this.update = function (mouseX, mouseZ) {
        arrow = [mouseX, 0, mouseZ];
        Common.subtractFromVector(arrow, arrow, Common.ARROW_ORIGIN);

        const arrowLength = Common.lengthOfVector(arrow);
        if (arrowLength > Common.MAX_WIND_SPEED * Common.WIND_SCALE) {
            Common.multiplyVectorByScalar(arrow, arrow, (Common.MAX_WIND_SPEED * Common.WIND_SCALE) / arrowLength);
        } else if (Common.lengthOfVector(arrow) < Common.MIN_WIND_SPEED * Common.WIND_SCALE) {
            Common.multiplyVectorByScalar(arrow, arrow, (Common.MIN_WIND_SPEED * Common.WIND_SCALE) / arrowLength);
        }

        Common.addToVector(tip, Common.ARROW_ORIGIN, arrow);

        render();

        valueX = arrow[0] / Common.WIND_SCALE;
        valueY = arrow[2] / Common.WIND_SCALE;
    };

    this.getValue = function () {
        return Common.lengthOfVector(arrow) / Common.WIND_SCALE;
    };

    this.getValueX = function () {
        return valueX;
    };

    this.getValueY = function () {
        return valueY;
    };

    this.distanceToTip = function (vector) {
        return Common.distanceBetweenVectors(tip, vector);
    };

    this.getTipZ = function () {
        return tip[2];
    };

    render();
};

export const Slider = function (parent, x, z, length, minValue, maxValue, value, sliderBreadth, handleSize) {
    const sliderLeftDiv = document.createElement('div');
    sliderLeftDiv.style.position = 'absolute';
    sliderLeftDiv.style.width = length + 'px';
    sliderLeftDiv.style.height = sliderBreadth + 'px';
    sliderLeftDiv.style.backgroundColor = Common.SLIDER_LEFT_COLOR;
    Common.setTransformOrigin(sliderLeftDiv, 'center top');
    Common.setTransform(sliderLeftDiv, 'translate3d(' + x + 'px, 0, ' + z + 'px) rotateX(90deg)');
    parent.appendChild(sliderLeftDiv);

    const sliderRightDiv = document.createElement('div');
    sliderRightDiv.style.position = 'absolute';
    sliderRightDiv.style.width = length + 'px';
    sliderRightDiv.style.height = sliderBreadth + 'px';
    sliderRightDiv.style.backgroundColor = Common.SLIDER_RIGHT_COLOR;
    Common.setTransformOrigin(sliderRightDiv, 'center top');
    Common.setTransform(sliderRightDiv, 'translate3d(' + x + 'px, 0, ' + z + 'px) rotateX(90deg)');
    parent.appendChild(sliderRightDiv);

    const handleDiv = document.createElement('div');
    handleDiv.style.position = 'absolute';
    handleDiv.style.width = handleSize + 'px';
    handleDiv.style.height = handleSize + 'px';
    handleDiv.style.borderRadius = handleSize * 0.5 + 'px';
    handleDiv.style.background = Common.HANDLE_COLOR;
    Common.setTransformOrigin(handleDiv, 'center top');
    Common.setTransform(handleDiv, 'translate3d(' + x + 'px, 0px, ' + z + 'px) rotateX(90deg)');
    parent.appendChild(handleDiv);

    const handleX = (x + ((value - minValue) / (maxValue - minValue)) * length) - handleDiv.offsetWidth / 2;

    const render = function () {
        const fraction = (value - minValue) / (maxValue - minValue);

        Common.setTransform(handleDiv, 'translate3d(' + (handleX - handleDiv.offsetWidth * 0.5) + 'px, 0, ' + (z - handleDiv.offsetHeight * 0.5) + 'px) rotateX(90deg)');
        sliderLeftDiv.style.width = fraction * length + 'px';
        sliderRightDiv.style.width = (1.0 - fraction) * length + 'px';
        Common.setTransform(sliderRightDiv, 'translate3d(' + (x + fraction * length) + 'px, 0, ' + z + 'px) rotateX(90deg)');
    };

    this.update = function (mouseX, callback) {
        handleX = Common.clamp(mouseX, x, x + length);
        const fraction = Common.clamp((mouseX - x) / length, 0.0, 1.0);
        value = minValue + fraction * (maxValue - minValue);

        callback(value);

        render();
    };

    this.getValue = function () {
        return value;
    };

    this.distanceToHandle = function (vector) {
        return Common.distanceBetweenVectors([handleX, 0, z], vector);
    };

    render();
};
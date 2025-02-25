import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WheelController')
export class WheelController extends Component {
    @property({ tooltip: "Скорость вращения колеса" })
    rotationSpeed: number = 0;

    @property({ tooltip: "Максимальная скорость вращения" })
    maxRotationSpeed: number = 1;

    private _currentRotation: number = 0;

    start() {
        // Начинаем с текущего угла вращения вокруг локальной оси Y
        this._currentRotation = this.node.eulerAngles.y;
    }

    setRotationSpeed(newSpeed: number) {
        // Устанавливаем скорость вращения колеса
        this.rotationSpeed = newSpeed * this.maxRotationSpeed;

        // Запускаем анимацию вращения
        this.rotateWheel();
    }

    rotateWheel() {
        if (this.rotationSpeed > 0) {
            // Вычисляем целевой угол вращения вокруг локальной оси Y
            const targetRotation = this._currentRotation - this.rotationSpeed;

            // Анимация вращения
            tween(this.node)
                .to(0.1, { eulerAngles: new Vec3(-90, 0, targetRotation) }) // Вращение вокруг локальной оси Y
                .call(() => { 
                    this._currentRotation = targetRotation;
                    this.rotateWheel(); // Повторяем анимацию
                })
                .start();
        }
    }
}

// import { _decorator, Component, Node, Vec3, tween } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('WheelController')
// export class WheelController extends Component {
//     start() {
//         this.rotateCoin();
//     }

//     rotateCoin() {
//         const rotate = () => {
            // const startRotation = this.node.eulerAngles.clone();
            // const endRotation = new Vec3(startRotation.x, startRotation.y, startRotation.z - 360);

            // tween(this.node)
            //     .to(2, { eulerAngles: endRotation })
            //     .call(() => {
            //         // Сбросить угол вращения обратно к начальному значению
            //         this.node.eulerAngles = new Vec3(endRotation);
            //         rotate(); // Запустить следующий цикл вращения
            //     })
//                 .start();
//         };

//         rotate(); // Запустить первый цикл вращения
//     }
// }



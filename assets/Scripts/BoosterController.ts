import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PropellerController')
export class PropellerController extends Component {
    @property({ tooltip: "Скорость вращения пропеллера" })
    rotationSpeed: number = 0;

    @property({ tooltip: "Максимальная скорость вращения" })
    maxRotationSpeed: number = 1;

    private _currentRotation: number = 0;

    start() {
        this._currentRotation = this.node.eulerAngles.x;
    }

    setRotationSpeed(newSpeed: number) {
        // Устанавливаем скорость вращения пропеллера
        this.rotationSpeed = newSpeed * this.maxRotationSpeed;

        // Запускаем анимацию вращения
        this.rotatePropeller();
    }

    rotatePropeller() {
        if (this.rotationSpeed > 0) {
            // Вычисляем целевой угол вращения
            const targetRotation = this._currentRotation + this.rotationSpeed;

            // Анимация вращения
            tween(this.node)
                .to(0.1, { eulerAngles: new Vec3(targetRotation, 0, 0) })
                .call(() => {
                    this._currentRotation = targetRotation;
                    this.rotatePropeller(); // Повторяем анимацию
                })
                .start();
        }
    }
}

// import { _decorator, Component, Node, Vec3, tween } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('BoosterController')
// export class BoosterController extends Component {
//     start() {
//         this.rotateCoin();
//     }

//     rotateCoin() {
//         const rotate = () => {
//             const startRotation = this.node.eulerAngles.clone();
//             const endRotation = new Vec3(startRotation.x + 360, startRotation.y, startRotation.z);

//             tween(this.node)
//                 .to(2, { eulerAngles: endRotation })
//                 .call(() => {
//                     // Сбросить угол вращения обратно к начальному значению
//                     this.node.eulerAngles = new Vec3(endRotation);
//                     rotate(); // Запустить следующий цикл вращения
//                 })
//                 .start();
//         };

//         rotate(); // Запустить первый цикл вращения
//     }
// }



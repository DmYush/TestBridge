import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WheelController')
export class WheelController extends Component {
    start() {
        this.rotateCoin();
    }

    rotateCoin() {
        const rotate = () => {
            const startRotation = this.node.eulerAngles.clone();
            const endRotation = new Vec3(startRotation.x, startRotation.y, startRotation.z - 360);

            tween(this.node)
                .to(2, { eulerAngles: endRotation })
                .call(() => {
                    // Сбросить угол вращения обратно к начальному значению
                    this.node.eulerAngles = new Vec3(endRotation);
                    rotate(); // Запустить следующий цикл вращения
                })
                .start();
        };

        rotate(); // Запустить первый цикл вращения
    }
}



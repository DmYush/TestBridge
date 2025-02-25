import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Node)
    playerNode: Node = null;

    private offset: Vec3 = new Vec3(-12, 15, 37); // Смещение камеры
    private initialRotation: Quat = Quat.fromEuler(new Quat(), -18, -21, 0); // Начальный поворот камеры

    protected start(): void {
        // Устанавливаем начальный поворот камеры
        this.node.setRotation(this.initialRotation);
    }

    protected update(deltaTime: number): void {
        if (this.playerNode) {
            // Получаем текущую позицию игрока
            const targetPosition = this.playerNode.position.clone(); // Клонируем позицию игрока
            
            // Устанавливаем новую позицию камеры с учетом смещения
            const newCameraPosition = targetPosition.add(this.offset.clone());
            this.node.setPosition(newCameraPosition);
            
            // Поворачиваем камеру к объекту, но сохраняем начальный поворот
            this.node.setRotation(this.initialRotation);
        }
    }
}



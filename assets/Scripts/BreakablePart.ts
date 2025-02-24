import { _decorator, Component, Node, RigidBody, Vec3, Collider, ERigidBodyType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BreakablePart')
export class BreakablePart extends Component {
    @property
    explodeForce: number = 5; // Сила разлета

    @property
    destroyAfter: number = 5; // Время через которое объект уничтожится

    public break() {
        // Добавляем компонент RigidBody, если его нет
        let rb = this.node.getComponent(RigidBody);
        if (!rb) {
            rb = this.node.addComponent(RigidBody);
        }

        // Устанавливаем свойства Rigidbody
        rb.type = ERigidBodyType.DYNAMIC; // Делаем объект динамическим
        rb.mass = 1; // Устанавливаем массу

        // Генерируем случайное направление для разлета
        const forceDirection = Vec3.random(new Vec3(), 1).normalize().multiplyScalar(this.explodeForce);

        // Применяем силу разлета
        rb.applyImpulse(forceDirection); // Применяем импульс

        // Отключаем коллайдер, если требуется
        const collider = this.node.getComponent(Collider);
        if (collider) {
            collider.enabled = false; // Отключаем коллайдер
        }

        // Удаляем объект через указанное время
        this.scheduleOnce(() => {
            this.destroy;
        }, this.destroyAfter);
    }
}



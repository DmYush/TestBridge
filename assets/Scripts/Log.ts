import { _decorator, Component, RigidBody, Collider, ICollisionEvent, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('Log')
export class Log extends Component {
    private rigidBody: RigidBody = null;
    private collider: Collider = null;

    onLoad() {
        //console.log("Я объект: ", this.node.name);
        this.rigidBody = this.getComponent(RigidBody);
        this.collider = this.getComponent(Collider);

        if (!this.rigidBody) {
            console.error("RigidBody component is missing on Log!");
        }
        if (!this.collider) {
            console.error("Collider component is missing on Log!");
        }

        // На старте делаем RigidBody кинематическим
        if (this.rigidBody) {
            this.rigidBody.isKinematic = true;
        }
    }

    onEnable() {
        if (this.collider) {
            this.collider.on("onCollisionEnter", this.onCollisionEnter, this);
        }
    }

    onDisable() {
        if (this.collider) {
            this.collider.off("onCollisionEnter", this.onCollisionEnter, this);
        }
    }

    private onCollisionEnter(event: ICollisionEvent) {
        // Получаем коллайдер другого объекта
        const otherCollider = event.otherCollider;
        if (!otherCollider || !otherCollider.node) {
            console.error("Invalid collision event: otherCollider or otherCollider.node is missing!");
            return;
        }

        const otherNode: Node = otherCollider.node;
        console.log("Collision detected with:", otherNode.name);

        if (otherNode.name === 'Player') {
            console.log("Collision with Player detected!");
            this.fall();
        }
    }

    fall() {
        console.log("Log is falling");
        if (this.rigidBody) {
            this.rigidBody.isKinematic = false; // Делаем бревно некинематическим
        } else {
            console.error("RigidBody is missing on Log!");
        }
    }
}


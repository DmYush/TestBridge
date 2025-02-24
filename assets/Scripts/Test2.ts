import { _decorator, Component, Collider, RigidBody, ICollisionEvent, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test2')
export class Test2 extends Component {
    @property(RigidBody)
    rigidBody: RigidBody = null;

    // public start () {
    //     let collider = this.node.getComponent(Collider);
    //     // Listening to 'onCollisionStay' Events
    //     collider.on('onCollisionStay', this.onCollision, this);
    //     const rigidBody = this.getComponent(RigidBody);
    //     rigidBody.useCCD = true;
    // }

    onLoad() {
        console.log("Test2 объект загружен: ", this.node.name);
    }

    private onCollision (event: ICollisionEvent) {
        console.log(event.type, event);
    }

    onCollisionEnter(other: Collider) {
        console.log("Test2 столкновение с: ", other.node.name);
        // Здесь можно добавить логику при столкновении
    }

    onCollisionStay(other: Collider) {
        console.log("Test2 остается в столкновении с: ", other.node.name);
        // Здесь можно добавить логику, пока объект остается в столкновении
    }

    onCollisionExit(other: Collider) {
        console.log("Test2 вышел из столкновения с: ", other.node.name);
        // Здесь можно добавить логику при выходе из столкновения
    }
}



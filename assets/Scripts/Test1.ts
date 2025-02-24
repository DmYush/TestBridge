import { _decorator, Component, Collider, RigidBody, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test1')
export class Test1 extends Component {
    @property(RigidBody)
    rigidBody: RigidBody = null;

    start(): void {
        var collider = this.node.getComponent(Collider)
        collider?.on("onCollisionEnter", this.onCollisionEnter, this);
        collider?.on("onCollisionStay", this.onCollisionStay, this);
        collider?.on("onCollisionExit", this.onCollisionExit, this);
    }

    onLoad() {
        console.log("Test1 объект загружен: ", this.node.name);
    }

    private onCollisionEnter(event?: ICollisionEvent): void {
        console.log("Enter");
    }

    private onCollisionStay(event?: ICollisionEvent): void {
        console.log("Stay");
    }

    private onCollisionExit(event?: ICollisionEvent): void {
        console.log("Exit");
    }

    // onCollisionEnter(other: Collider) {
    //     console.log("Test1 столкновение с: ", other.node.name);
    //     // Здесь можно добавить логику при столкновении
    // }

    // onCollisionStay(other: Collider) {
    //     console.log("Test1 остается в столкновении с: ", other.node.name);
    //     // Здесь можно добавить логику, пока объект остается в столкновении
    // }

    // onCollisionExit(other: Collider) {
    //     console.log("Test1 вышел из столкновения с: ", other.node.name);
    //     // Здесь можно добавить логику при выходе из столкновения
    // }
}



import { _decorator, Component, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroll')
export class BackgroundScroll extends Component {
    @property({type: Node, tooltip: "Ссылка на игрока" })
    player: Node = null;

    @property({ tooltip: "Коэффициент parallax (0.5 = фон движется в 2 раза медленнее)" })
    parallaxFactor: number = 0.5;

    private initialPosition: Vec3 = new Vec3();

    onLoad() {
        this.initialPosition = this.node.position.clone(); // Сохраняем начальную позицию фона
    }

    update(deltaTime: number) {
        if (!this.player) {
            console.error("Player is not assigned!");
            return;
        }

        // Вычисляем новую позицию фона
        const playerPosition = this.player.position;
        const newPosition = new Vec3(
            this.initialPosition.x + playerPosition.x * this.parallaxFactor,
            this.initialPosition.y,
            this.initialPosition.z
        );

        this.node.setPosition(newPosition);
    }
}



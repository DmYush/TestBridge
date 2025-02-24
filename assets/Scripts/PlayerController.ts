import { _decorator, Component, Node, Collider, RigidBody, ERigidBodyType, Vec3, ITriggerEvent } from 'cc';
import { BreakablePart } from './BreakablePart'; // Импортируем класс BreakablePart
import { GameManager } from './GameManager'; // Импортируем класс GameManager
const { ccclass, property } = _decorator;

// Определяем имена слоев
const LayerName = {
    Log: 1, // Замените 1 на фактический номер вашего слоя для бревен
};

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ tooltip: "Скорость машины" })
    speed: number = 0;

    @property({ tooltip: "Макс скорость машины" })
    maxSpeed: number = 10;

    @property({ tooltip: "Минимальная скорость машины" })
    minSpeed: number = 0;

    @property({ type: Node, tooltip: "Узел машины" })
    carNode: Node = null; // Ссылка на узел машины

    @property({ type: Node, tooltip: "Ссылка на GameManager" })
    gameManagerNode: Node = null; // Это узел GameManager

    private _isMoving: boolean = true; // Флаг для управления движением
    private gameManager: GameManager = null; // Сам компонент GameManager

    onLoad() {
        console.log("Я объект: ", this.node.name);

        // Инициализация gameManager из узла
        if (this.gameManagerNode) {
            this.gameManager = this.gameManagerNode.getComponent(GameManager);
            if (!this.gameManager) {
                console.warn("GameManager компонент не найден на заданном узле.");
            }
        }

        // Убедимся, что RigidBody и Collider настроены правильно
        const rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.type = ERigidBodyType.DYNAMIC; // Устанавливаем тип RigidBody
            rigidBody.mass = 1; // Устанавливаем массу
        }

        const collider = this.node.getComponent(Collider);
        if (collider) {
            collider.enabled = true; // Включаем коллайдер

            // Подписываемся на события триггера
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    update(deltaTime: number) {
        if (this._isMoving && this.speed > 0) {
            console.log("Speed:", this.speed); // Отладка
            // Обновляем позицию узла на основе скорости
            const targetPosition = this.node.position.x + this.speed * deltaTime; // Умножаем на deltaTime для плавного движения
            this.node.setPosition(new Vec3(targetPosition, this.node.position.y, this.node.position.z));
        }
    }

    setSpeed(newSpeed: number) {
        this.speed = newSpeed;
    }

    onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider; // Получаем коллайдер, с которым произошло столкновение
        console.log("Trigger entered with:", other.node.name);
        if (other.node.layer === LayerName.Log) {
            this.breakCar(); // Вызываем метод для разваливания машины

            // Останавливаем движение
            this._isMoving = false;

            // Показываем окно проигрыша через 2 секунды
            this.scheduleOnce(() => {
                if (this.gameManager) {
                    this.gameManager.showFailScreen(); // Показываем окно FailScreen
                }
            }, 1);
        }
    }

    breakCar() {
        if (!this.carNode) return;

        // Получаем все дочерние узлы машины (колеса, кузов и т.д.)
        const carParts = this.carNode.children;

        // Для каждой части машины вызываем метод break()
        carParts.forEach(part => {
            const breakablePart = part.getComponent(BreakablePart);
            if (breakablePart) {
                breakablePart.break(); // Разваливаем часть
            }
        });

        console.log("Машина развалилась!");
    }
}

    // private _startJump: boolean = false;
    // private _jumpStep: number = 0;
    // private _curJumpTime: number = 0;
    // private _jumpTime: number = 0.1;
    // private _curJumpSpeed: number = 0;
    // private _curPos: Vec3 = new Vec3();
    // private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // private _targetPos: Vec3 = new Vec3();

    // start() {
    //     input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    // }

    // onMouseUp(event: EventMouse) {
    //     if (event.getButton() === 0) {
    //         this.jumpByStep(1);
    //     } else if (event.getButton() === 2) {
    //         this.jumpByStep(2);
    //     }
    // }

    // jumpByStep(step: number) {
    //     if (this._startJump) {
    //         return;
    //     }
    //     this._startJump = true;
    //     this._jumpStep = step;
    //     this._curJumpTime = 0;
    //     this._curJumpSpeed = this._jumpStep / this._jumpTime;
    //     this.node.getPosition(this._curPos);
    //     Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
    // }

    // protected update(deltaTime: number): void {
    //     if (this._startJump) {
    //         this._curJumpTime += deltaTime;
    //         if (this._curJumpTime > this._jumpTime) {
    //             this.node.setPosition(this._targetPos);
    //             this._startJump = false;
    //         } else {
    //             this.node.getPosition(this._curPos);
    //             this._deltaPos.x = this._curJumpSpeed * deltaTime;
    //             Vec3.add(this._curPos, this._curPos, this._deltaPos);
    //             this.node.setPosition(this._curPos);
    //         }
    //     }
    // }




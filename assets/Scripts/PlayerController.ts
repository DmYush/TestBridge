// Импортируем необходимые модули из движка Cocos Creator
import { _decorator, Component, Node, Collider, RigidBody, ERigidBodyType, Vec3, ITriggerEvent } from 'cc';
import { BreakablePart } from './BreakablePart'; // Импортируем класс BreakablePart для управления разрушаемыми частями
import { FailScreen } from './FailScreen'; // Импортируем класс FailScreen для отображения экрана проигрыша
import { WheelController } from './WheelController'; // Импортируем WheelController для управления колесами
import { PropellerController } from './BoosterController'; // Импортируем PropellerController для управления пропеллером

// Декораторы для работы с Cocos Creator
const { ccclass, property } = _decorator;

// Определяем имена слоев (например, для столкновений)
const LayerName = {
    Log: 1, // Замените 1 на фактический номер вашего слоя для бревен
};

// Декоратор @ccclass указывает, что этот класс является компонентом Cocos Creator
@ccclass('PlayerController')
export class PlayerController extends Component {
    // Свойство speed: скорость машины
    @property({ tooltip: "Скорость машины" })
    speed: number = 0;

    // Свойство maxSpeed: максимальная скорость машины
    @property({ tooltip: "Макс скорость машины" })
    maxSpeed: number = 10;

    // Свойство minSpeed: минимальная скорость машины
    @property({ tooltip: "Минимальная скорость машины" })
    minSpeed: number = 0;

    // Свойство carNode: ссылка на узел машины
    @property({ type: Node, tooltip: "Узел машины" })
    carNode: Node = null;

    // Свойство failScreen: ссылка на экран проигрыша
    @property({ type: FailScreen, tooltip: "Ссылка на FailScreen" })
    failScreen: FailScreen = null;

    // Свойства для колес: ссылки на узлы колес
    @property({ type: Node, tooltip: "Колесо 1" })
    wheel1: Node = null;

    @property({ type: Node, tooltip: "Колесо 2" })
    wheel2: Node = null;

    @property({ type: Node, tooltip: "Колесо 3" })
    wheel3: Node = null;

    @property({ type: Node, tooltip: "Колесо 4" })
    wheel4: Node = null;

    // Свойство propeller: ссылка на узел пропеллера
    @property({ type: Node, tooltip: "Пропеллер" })
    propeller: Node = null;

    // Приватное свойство _isMoving: флаг, указывающий, движется ли машина
    private _isMoving: boolean = true;

    // Метод onLoad вызывается при загрузке компонента
    onLoad() {
        console.log("Я объект: ", this.node.name);

        // Настраиваем RigidBody (физическое тело) для машины
        const rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.type = ERigidBodyType.DYNAMIC; // Устанавливаем тип RigidBody как DYNAMIC (динамический)
            rigidBody.mass = 1; // Устанавливаем массу тела
        }

        // Настраиваем Collider (коллайдер) для машины
        const collider = this.node.getComponent(Collider);
        if (collider) {
            collider.enabled = true; // Включаем коллайдер

            // Подписываемся на событие onTriggerEnter (когда объект входит в триггер)
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    // Метод update вызывается каждый кадр
    update(deltaTime: number) {
        // Если машина движется и скорость больше 0
        if (this._isMoving && this.speed > 0) {
            // Вычисляем новую позицию машины на основе скорости и времени
            const targetPosition = this.node.position.x + this.speed * deltaTime;
            // Устанавливаем новую позицию машины
            this.node.setPosition(new Vec3(targetPosition, this.node.position.y, this.node.position.z));
        }
    }

    // Метод для установки скорости машины
    setSpeed(newSpeed: number) {
        this.speed = newSpeed;

        // Обновляем скорость вращения колес
        if (this.wheel1) {
            const wheelController = this.wheel1.getComponent(WheelController); // Получаем компонент WheelController
            if (wheelController) {
                wheelController.setRotationSpeed(this.speed / this.maxSpeed); // Устанавливаем скорость вращения
            }
        }
        if (this.wheel2) {
            const wheelController = this.wheel2.getComponent(WheelController);
            if (wheelController) {
                wheelController.setRotationSpeed(this.speed / this.maxSpeed);
            }
        }
        if (this.wheel3) {
            const wheelController = this.wheel3.getComponent(WheelController);
            if (wheelController) {
                wheelController.setRotationSpeed(this.speed / this.maxSpeed);
            }
        }
        if (this.wheel4) {
            const wheelController = this.wheel4.getComponent(WheelController);
            if (wheelController) {
                wheelController.setRotationSpeed(this.speed / this.maxSpeed);
            }
        }

        // Обновляем скорость вращения пропеллера
        if (this.propeller) {
            const propellerController = this.propeller.getComponent(PropellerController); // Получаем компонент PropellerController
            if (propellerController) {
                propellerController.setRotationSpeed(this.speed / this.maxSpeed); // Устанавливаем скорость вращения
            }
        }
    }

    // Метод onTriggerEnter вызывается, когда объект входит в триггер
    onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider; // Получаем коллайдер, с которым произошло столкновение
        console.log("Trigger entered with:", other.node.name);

        // Проверяем, если столкновение произошло с объектом на слое Log (бревно)
        if (other.node.layer === LayerName.Log) {
            this.breakCar(); // Вызываем метод для разрушения машины

            // Останавливаем движение
            this._isMoving = false;

            // Показываем экран проигрыша через 1 секунду
            this.scheduleOnce(() => {
                if (this.failScreen) {
                    this.failScreen.show(); // Вызываем метод show у FailScreen
                }
            }, 1);
        }
    }

    // Метод для разрушения машины
    breakCar() {
        if (!this.carNode) return;

        // Получаем все дочерние узлы машины (колеса, кузов и т.д.)
        const carParts = this.carNode.children;

        // Для каждой части машины вызываем метод break()
        carParts.forEach(part => {
            const breakablePart = part.getComponent(BreakablePart);
            if (breakablePart) {
                breakablePart.break(); // Разрушаем часть
            }
        });

        console.log("Машина развалилась!");
    }
}



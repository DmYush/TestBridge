import { _decorator, Component, Node, Vec3, tween, Collider, ITriggerEvent, UITransform, UIOpacity } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CoinController')
export class CoinController extends Component {
    @property({ type: Node })
    player: Node = null;

    @property({ type: Node, tooltip: "Перетащите сюда UI-элемент с монетами" })
    coinUITarget: Node = null;

    start() {
        this.rotateCoin();
        const collider = this.getComponent(Collider);
        if (collider) collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    rotateCoin() {
        tween(this.node)
            .repeatForever(
                tween()
                    .to(2, { eulerAngles: new Vec3(0, 360, 0) })
                    .to(0, { eulerAngles: Vec3.ZERO })
            ).start();
    }

    onTriggerEnter(event: ITriggerEvent) {
        console.log("Контакт с объектом:", event.otherCollider.node.name); // Отладка
        if (event.otherCollider.node === this.player) {
            console.log("Контакт с игроком!"); // Отладка
            this.collectCoin();
        }
    }

    collectCoin() {
        const collider = this.getComponent(Collider);
        if (collider) collider.enabled = false;
    
        // Получаем компонент UITransform UI-элемента
        const uiTransform = this.coinUITarget.getComponent(UITransform);
    
        // Рассчитываем позицию правого верхнего угла элемента
        const elementWidth = uiTransform.width;
        const elementHeight = uiTransform.height;
        const pivotX = uiTransform.anchorX; // Обычно 0.5 для центра, но зависит от настроек
        const pivotY = uiTransform.anchorY;
    
        // Смещение к правому верхнему углу
        const localOffset = new Vec3(
            elementWidth * (0.5 - pivotX), // Смещение по X
            elementHeight * (0.5 - pivotY), // Смещение по Y
            0
        );
    
        // Конвертируем локальное смещение в мировые координаты
        const targetWorldPos = uiTransform.convertToWorldSpaceAR(localOffset);
    
        // Анимация к правому верхнему углу
        tween(this.node)
            .to(20, { worldPosition: targetWorldPos })
            .call(() => this.node.destroy())
            .start();
    
        // Обновляем счет
        const gameManager = this.node.scene.getComponentInChildren<GameManager>(GameManager);
        if (gameManager) gameManager.addCoin();
    }
}



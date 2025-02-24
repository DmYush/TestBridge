import { _decorator, Component, Node, tween, Vec3, Button, Label, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FailScreen')
export class FailScreen extends Component {
    @property({ type: Node, tooltip: "Кнопка Retry" })
    retryButton: Node = null;

    @property({ type: Node, tooltip: "Значок фейла" })
    failIcon: Node = null;

    @property({ type: Node, tooltip: "Фон затемнения" })
    background: Node = null;

    @property({ type: Node, tooltip: "Кнопка Download" })
    downloadButton: Node = null;

    onLoad() {
        // Скрываем окно проигрыша при старте
        this.node.active = false;
    }

    public show() {
        // Показываем окно проигрыша
        this.node.active = true;

        // Показываем значок фейла
        this.failIcon.active = true;

        // Плавное исчезновение кнопки Download
        const downloadButtonOpacity = this.downloadButton.getComponent(UIOpacity) || this.downloadButton.addComponent(UIOpacity);
        downloadButtonOpacity.opacity = 255; // Устанавливаем начальную прозрачность
        tween(downloadButtonOpacity)
            .to(0.5, { opacity: 0 }) // Плавно уменьшаем прозрачность до 0
            .call(() => {
                this.downloadButton.active = false; // Отключаем кнопку после исчезновения
            })
            .start();

        // Анимация появления кнопки Retry
        tween(this.retryButton)
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();

        // Анимация пульсации кнопки Retry
        tween(this.retryButton)
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    public hide() {
        // Скрываем окно проигрыша
        this.node.active = false;
    }

    public setupRetryButton(callback: Function) {
        const button = this.retryButton.getComponent(Button);
        if (button) {
            button.node.on(Button.EventType.CLICK, callback, this);
        }
    }
}


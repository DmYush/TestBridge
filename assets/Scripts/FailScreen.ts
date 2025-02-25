import { _decorator, Component, Node, tween, Vec3, Button, UIOpacity, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FailScreen')
export class FailScreen extends Component {
    @property({ type: Node, tooltip: "Кнопка Retry" })
    retryButton: Node = null;

    @property({ type: Node, tooltip: "Значок фейла" })
    failIcon: Node = null;

    @property({ type: Node, tooltip: "Фон затемнения" })
    background: Node = null;

    @property({ type: Node, tooltip: "Кнопка Download (на канвасе)" })
    downloadButton: Node = null; // Кнопка Download на канвасе

    @property({ type: Node, tooltip: "Узел для обработки кликов по всему экрану" })
    fullScreenClickHandler: Node = null; // Узел для обработки кликов

    private isIOS: boolean = false;
    private isAndroid: boolean = false;

    onLoad() {
        // Определяем платформу
        this.isIOS = sys.os === sys.OS.IOS;
        this.isAndroid = sys.os === sys.OS.ANDROID;

        console.log("Platform:", sys.os); // Отладка

        // Скрываем окно проигрыша при старте
        this.node.active = false;

        // Устанавливаем начальный масштаб кнопки Retry
        if (this.retryButton) {
            this.retryButton.setScale(new Vec3(0.1, 0.1, 0.1));
        }

        // Назначаем обработчик кликов на весь экран
        if (this.fullScreenClickHandler) {
            const button = this.fullScreenClickHandler.getComponent(Button);
            if (button) {
                button.node.on(Button.EventType.CLICK, this.onScreenClick, this);
            }
        }

        // Назначаем обработчик кликов на кнопку Retry
        if (this.retryButton) {
            const button = this.retryButton.getComponent(Button);
            if (button) {
                button.node.on(Button.EventType.CLICK, this.onRetryClick, this);
            }
        }
    }

    public show() {
        console.log("Метод show вызван");

        // Показываем окно проигрыша
        this.node.active = true;

        // Показываем значок фейла
        this.failIcon.active = true;

        // Плавное исчезновение кнопки Download
        if (this.downloadButton) {
            console.log("Запуск анимации для кнопки Download");
            const downloadButtonOpacity = this.downloadButton.getComponent(UIOpacity) || this.downloadButton.addComponent(UIOpacity);
            downloadButtonOpacity.opacity = 255; // Устанавливаем начальную прозрачность
            tween(downloadButtonOpacity)
                .to(0.5, { opacity: 0 }) // Плавно уменьшаем прозрачность до 0
                .call(() => {
                    this.downloadButton.active = false; // Отключаем кнопку после исчезновения
                })
                .start();
        }

        // Анимация увеличения кнопки Retry
        if (this.retryButton) {
            console.log("Запуск анимации для кнопки Retry");
            tween(this.retryButton)
                .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // Увеличиваем масштаб до (1, 1, 1)
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
    }

    public hide() {
        // Скрываем окно проигрыша
        this.node.active = false;

        // Включаем кнопку Download (если нужно)
        if (this.downloadButton) {
            this.downloadButton.active = true;
            const downloadButtonOpacity = this.downloadButton.getComponent(UIOpacity);
            if (downloadButtonOpacity) {
                downloadButtonOpacity.opacity = 255; // Возвращаем прозрачность
            }
        }
    }

    private onScreenClick() {
        this.redirectToStore();
    }

    private onRetryClick() {
        this.redirectToStore();
    }

    private redirectToStore() {
        if (this.isIOS) {
            // Ссылка на App Store
            window.location.href = "https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139";
            console.log("Redirecting to App Store");
        } else {
            // Ссылка на Google Play (для Android и ПК)
            window.location.href = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en";
            console.log("Redirecting to Google Play");
        }
    }
}


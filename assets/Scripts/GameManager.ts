import { _decorator, Component, Node, Slider, Vec3, tween, UIOpacity, Label, sys, view } from 'cc';
import { PlayerController } from './PlayerController';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // Ссылка на слайдер
    @property(Slider)
    slider: Slider = null;

    // Ссылка на машину
    @property(Node)
    player: Node = null;

    // Ссылка на руку туториала
    @property(Node)
    tutorialHand: Node = null;

    // Ссылка на текстовый элемент для отображения счета монет
    @property(Label)
    coinLabel: Label = null;

    // Ссылка на окно проигрыша
    @property(Node)
    failScreen: Node = null;

    // Ссылка на кнопку Download
    @property(Node)
    downloadButton: Node = null;

    // Настройки туториала
    @property({ tooltip: "Задержка перед повтором туториала (секунды)" })
    tutorialRepeatDelay: number = 3;

    @property({ tooltip: "Скорость анимации (рекомендуется 0.5)" })
    animationSpeed: number = 0.5;

    // Счет монет
    private coinCount: number = 0;

    // Флаги состояния
    private isTutorialActive: boolean = true;
    private hasPlayerInteracted: boolean = false;
    private initialHandPosition: Vec3 = new Vec3();

    // Переменные для определения платформы
    private isIOS: boolean = false;
    private isAndroid: boolean = false;

    

    onLoad() {
        const visibleSize = view.getVisibleSize();
        console.log(`Ширина экрана: ${visibleSize.width}, Высота экрана: ${visibleSize.height}`);
        console.log("GameManager: onLoad"); // Отладка

        // Определяем платформу
        this.isIOS = sys.os === sys.OS.IOS;
        this.isAndroid = sys.os === sys.OS.ANDROID;

        console.log("Platform:", sys.os); // Отладка

        // Отключаем окно FailScreen на старте
        if (this.failScreen) {
            this.failScreen.active = false;
        }

        // Сохраняем начальную позицию руки
        if (this.tutorialHand) {
            this.initialHandPosition = this.tutorialHand.position.clone();
        }
    }

    start() {
        console.log("GameManager: start"); // Отладка

        // Инициализация слайдера
        if (this.slider && this.player) {
            this.slider.node.on('slide', this.onSliderChange, this);
        }

        // Запуск туториала
        if (this.tutorialHand) {
            this.tutorialHand.active = false;
            this.scheduleOnce(() => this.playTutorial(), 1);
        }

        // Инициализация счета монет
        this.updateCoinLabel();

    // Добавляем обработчик для кнопки Download
    if (this.downloadButton) {
        console.log("Download button found, adding click handler"); // Отладка
        this.downloadButton.on('click', this.redirectToStore, this);
    } else {
        console.log("Download button not found!"); // Отладка
    }
    }

    onSliderChange() {
        // Обновляем скорость машины
        const speed = this.slider.progress * this.player.getComponent(PlayerController).maxSpeed;
        this.player.getComponent(PlayerController).setSpeed(speed);

        // Останавливаем туториал при первом взаимодействии
        if (!this.hasPlayerInteracted) {
            this.hasPlayerInteracted = true;
            this.stopTutorial();
        }
    }

    playTutorial() {
        if (!this.isTutorialActive || this.hasPlayerInteracted) return;

        // Показываем руку в начальной позиции
        this.tutorialHand.active = true;
        this.tutorialHand.setPosition(this.initialHandPosition);
        
        const handOpacity = this.tutorialHand.getComponent(UIOpacity) || this.tutorialHand.addComponent(UIOpacity);
        handOpacity.opacity = 255;

        // Создаем целевые позиции в локальных координатах
        const startPos = this.initialHandPosition.clone();
        const endPos = startPos.clone();
        endPos.y += 200; // Смещаем на 200 пикселей вверх

        // Анимация движения
        tween(this.tutorialHand)
            .to(this.animationSpeed, { position: endPos })
            .to(this.animationSpeed, { position: startPos })
            .call(() => {
                // Плавное исчезновение
                tween(handOpacity)
                    .to(0.3, { opacity: 0 })
                    .call(() => {
                        this.tutorialHand.active = false;
                        // Повтор через задержку если не было взаимодействия
                        this.scheduleOnce(() => {
                            if (!this.hasPlayerInteracted) this.playTutorial();
                        }, this.tutorialRepeatDelay);
                    })
                    .start();
            })
            .start();
    }

    stopTutorial() {
        this.isTutorialActive = false;
        this.tutorialHand.active = false;
        this.unscheduleAllCallbacks();
    }

    // Метод для увеличения счета монет
    public addCoin() {
        this.coinCount += 1; // Увеличиваем счет
        this.updateCoinLabel(); // Обновляем текст
    }

    // Обновление текстового элемента
    updateCoinLabel() {
        if (this.coinLabel) {
            this.coinLabel.string = `${this.coinCount}`; // Обновляем текст
        }
    }

    // Метод для показа окна FailScreen
    public showFailScreen() {
        if (this.failScreen) {
            this.failScreen.active = true; // Включаем окно
        }
    }

    public redirectToStore() {
        console.log("RedirectToStore called"); // Отладка
        if (this.isIOS) {
            // Ссылка на App Store
            window.location.href = "https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139";
            console.log("Redirecting to App Store");
        } else if (this.isAndroid) {
            // Ссылка на Google Play
            window.location.href = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en";
            console.log("Redirecting to Google Play");
        } else {
            // Для Windows или других платформ
            window.location.href = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en"; // Замени на нужную ссылку
            console.log("Redirecting to GitHub (test link)");
        }
    }
}


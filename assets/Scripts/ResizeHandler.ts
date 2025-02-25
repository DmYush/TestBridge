import { _decorator, Component, screen, Widget } from 'cc';
const { ccclass } = _decorator;

@ccclass('ResizeHandler')
export class ResizeHandler extends Component {
    start() {
        this.updateUI();
        window.addEventListener('resize', this.updateUI.bind(this));
    }

    updateUI() {
        // Получаем все элементы с компонентом Widget
        const widgets = this.node.getComponentsInChildren(Widget);
        for (const widget of widgets) {
            // Обновляем позицию элемента
            widget.updateAlignment();
        }
    }
}



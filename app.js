export default class {
    constructor($target) {
        this.$canvas = document.createElement('canvas')
        
        $target.appendChild(this.$canvas)
        const context = this.$canvas.getContext('2d');

        context
    }
}
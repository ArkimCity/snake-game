export default class {
    constructor($target) {
        this.draw_hall_of_fame($target)

        this.canvas_width = '640'
        this.canvas_height = '640'
        this.animationInterval = 50 // ms
        this.init_length = 5
        
        this.$canvas = document.createElement('canvas')
        this.$canvas.width = this.canvas_width
        this.$canvas.height = this.canvas_height
        this.$score = document.createElement('div')
        this.$score.id = 'score'
        $target.appendChild(this.$score)
        $target.appendChild(this.$canvas)
        const context = this.$canvas.getContext('2d');

        this.cell_size = 16
        this.apple = {x: Math.floor(Math.random() * 40) * 16, y: Math.floor(Math.random() * 40) * 16}
        this.snake = {
            vx: this.cell_size,
            vy: 0,
            cells: [{x:96, y: 96}],
            length: this.init_length
        }

        this.render_single_time(context)

        this.render(context)
        this.add_direction_key()
    }

    draw_hall_of_fame($target) {
        
        this.$hall_of_fame = document.createElement('table')
        this.$hall_of_fame.innerText = "HALL OF FAME"
        this.$hall_of_fame.id = "hall_of_fame"

        this.$head_row = document.createElement('tr')
        this.$head_name = document.createElement('th')
        this.$head_name.innerText = "name"
        this.$head_score = document.createElement('th')
        this.$head_score.innerText = "score"
        this.$head_row.appendChild(this.$head_name)
        this.$head_row.appendChild(this.$head_score)

        this.$hall_of_fame.appendChild(this.$head_row)

        fetch("https://kimguro.synology.me:8081/records?_sort=score&_order=desc&_limit=25").then((response) => {
            return response.json()
        }).then((json_data) => {

            json_data.forEach((hall_of_fame_each_data) => {

                let $row = document.createElement('tr')

                let $name = document.createElement('td')
                $name.innerText = hall_of_fame_each_data.name
                let $score = document.createElement('td')
                $score.innerText = hall_of_fame_each_data.score

                $row.appendChild($name)
                $row.appendChild($score)

                this.$hall_of_fame.appendChild($row)
            })
            
            $target.appendChild(this.$hall_of_fame)
        })
    }

    render(context) {

        const loop = () => {
            this.render_single_time(context)
            
            setTimeout(() => {
                requestAnimationFrame(loop)
            }, this.animationInterval)
        }

        requestAnimationFrame(loop)
    }

    render_single_time(context) {
        context.clearRect(0,0, parseInt(this.canvas_width), parseInt(this.canvas_height))
        this.$score.innerText = 'ate ' + (this.snake.length - this.init_length) + ' apples'
        
        if (this.move_snake()) {
            return
        }

        this.draw_grid(context)
        this.draw_apple(context)
        this.draw_snake(context)

        return false
    }

    move_snake() {
        const next_x = this.snake.cells[this.snake.cells.length - 1].x + this.snake.vx
        const next_y = this.snake.cells[this.snake.cells.length - 1].y + + this.snake.vy

        if (this.death_check(next_x, next_y)) {
            
            let person = prompt("Your score is " + String(this.snake.length - this.init_length) + ". If you wish to register, please enter your name");
            let text;
            if (person == null || person == "") {

                alert("ok! have a great day!")

            } else {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "https://kimguro.synology.me:8081/records");

                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.onload = () => console.log(xhr.responseText);

                let data = {
                    "name": person,
                    "score": this.snake.length - this.init_length
                };

                xhr.send(JSON.stringify(data));
            }

            location.reload()
            return true
        }

        if (next_x == this.apple.x && next_y == this.apple.y) {
            this.snake.length++

            let apple_position = true

            let apple_next_x = Math.floor(Math.random() * 40) * 16
            let apple_next_y = Math.floor(Math.random() * 40) * 16

            // ?????? ????????? ?????? ????????? ????????? ?????? ??????
            while (apple_position) {
                let new_apple = true

                apple_next_x = Math.floor(Math.random() * 40) * 16
                apple_next_y = Math.floor(Math.random() * 40) * 16
    
                this.snake.cells.forEach((cell) => {
                    if (cell.x == apple_next_x && cell.y == apple_next_y) {
                        self_death = false
                    }
                })

                if (new_apple) {
                    apple_position = false
                }
            }

            this.apple.x = apple_next_x
            this.apple.y = apple_next_y
        }

        this.snake.cells.push(
            {x: next_x, y: next_y}
        )
        if (this.snake.cells.length > this.snake.length) {
            this.snake.cells.shift()
        }
    }

    draw_grid(context) {
        for (let i = 0; i < this.canvas_height / this.cell_size; i++) {

            context.strokeStyle = 'white';
            context.lineWidth = 0.5;
            context.beginPath();

            context.moveTo(0, i * this.cell_size);
            context.lineTo(this.canvas_height, i * this.cell_size);

            context.moveTo(i * this.cell_size, 0);
            context.lineTo(i * this.cell_size, this.canvas_height);

            context.stroke();
        }
    }

    draw_snake(context) {
        context.fillStyle = 'white';
        this.snake.cells.forEach(cell => {
            context.fillRect(cell.x, cell.y, this.cell_size-1, this.cell_size-1);
        });
    }

    draw_apple(context) {
        context.fillStyle = 'red';
        context.fillRect(this.apple.x, this.apple.y, this.cell_size-1, this.cell_size-1);
    }

    death_check(next_x, next_y) {
        let self_death = false

        if (next_x >= this.canvas_width || next_x < 0 || next_y >= this.canvas_height || next_y < 0) {
            return true
        }

        const check_cells = this.snake.cells.slice(1)
        this.snake.cells.slice(1).forEach((cell) => {
            if (cell.x == next_x && cell.y == next_y) {
                self_death = true
            }
        })

        if (self_death) {
            return true
        }
    }

    add_direction_key() {
        document.addEventListener('keydown', (e) => {
            if (e.key.match('ArrowUp')) {
                // vy == 0 ??? ????????? ?????? ???????????? ?????? ?????? ?????????, ?????? ?????? ???????????? ?????? ?????? ????????? ?????? ????????? ????????? ????????? ???????????? ?????????
                if (this.snake.cells[this.snake.cells.length - 1].y == this.snake.cells[this.snake.cells.length - 2].y) {
                    this.snake.vx = 0
                    this.snake.vy = - this.cell_size
                }
            } else if (e.key.match('ArrowDown')) {
                if (this.snake.cells[this.snake.cells.length - 1].y == this.snake.cells[this.snake.cells.length - 2].y) {
                    this.snake.vx = 0
                    this.snake.vy = this.cell_size
                }
            } else if (e.key.match('ArrowLeft')) {
                if (this.snake.cells[this.snake.cells.length - 1].x == this.snake.cells[this.snake.cells.length - 2].x) {
                    this.snake.vx = - this.cell_size
                    this.snake.vy = 0
                }
            } else if (e.key.match('ArrowRight')) {
                if (this.snake.cells[this.snake.cells.length - 1].x == this.snake.cells[this.snake.cells.length - 2].x) {
                    this.snake.vx = this.cell_size
                    this.snake.vy = 0
                }
            }
        })
    }
}
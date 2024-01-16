    // Movement
    moveUp() {
        this.dy = -this.speed * deltaTime;
        this.dx = 0;
        this.direction = Direction.UP;
    }

    moveLeft() {
        this.dx = -this.speed * deltaTime;
        this.dy = 0;
        this.direction = Direction.LEFT;
    }

    moveDown() {
        this.dy = this.speed * deltaTime;
        this.dx = 0;
        this.direction = Direction.DOWN;
    }

    moveRight() {
        this.dx = this.speed * deltaTime;
        this.dy = 0;
        this.direction = Direction.RIGHT;
    }

    // Inputs
    handleKeyDown(event) {
        event.preventDefault();

        switch(event.code) {
            case this.keybinds.move_up:
                this.moveUp();
                break;

            case this.keybinds.move_left:
                this.moveLeft();
                break;

            case this.keybinds.move_down:
                this.moveDown();
                break;

            case this.keybinds.move_right:
                this.moveRight();
                break;

            case this.keybinds.drop_bomb:
                this.dropBomb();
                break;
        }
    }

    handleKeyUp(event) {
        event.preventDefault();

        switch(event.code) {
            case this.keybinds.move_up:
            case this.keybinds.move_down:
                this.dy = 0;
                break;

            case this.keybinds.move_left:
            case this.keybinds.move_right:
                this.dx = 0;
                break;
        }
    }

    // Mobile controls
    bindMobile() {
        document.getElementById("mob-dir-up").addEventListener("touchstart", () => { this.moveUp() });
        document.getElementById("mob-dir-up").addEventListener("touchend", () => { this.dy = 0; });
        document.getElementById("mob-dir-down").addEventListener("touchstart", () => { this.moveDown() });
        document.getElementById("mob-dir-down").addEventListener("touchend", () => { this.dy = 0; });
        document.getElementById("mob-dir-right").addEventListener("touchstart", () => { this.moveRight() });
        document.getElementById("mob-dir-right").addEventListener("touchend", () => { this.dx = 0; });
        document.getElementById("mob-dir-left").addEventListener("touchstart", () => { this.moveLeft() });
        document.getElementById("mob-dir-left").addEventListener("touchend", () => { this.dx = 0; });
        document.getElementById("mob-bomb").addEventListener("touchstart", () => { this.dropBomb(); });
    }
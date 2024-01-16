restartLevel()
{
    // Check whether a player won the game
    if (this.player1Score >= this.scoreGoal || this.player2Score >= this.scoreGoal) { 
        this.isOver = true;
        setTimeout(() => {
            if (this.player1Score === this.player2Score) {
                showGGMenu(0, this.player1Score)
            }
            else if (this.player1Score > this.player1Score) {
                showGGMenu(1, this.player1Score)
            } else {
                showGGMenu(2, this.player2Score)
            }
        }, 4000);
    }
    if (this.isOver) return;

    // Prevent level restarting twice, if both players die at same time.
    if(this.restaring) return;

    this.restaring = true;




    export class MultiplayerGame extends Game
{
    constructor() {
        super();
        this.numPlayers = 2;
        this.player1Score = 0;
        this.player2Score = 0;
        this.scoreGoal = 1000;
        this.points = 1000; // Points per pvp kill
        this.timerHandle = null;
        this.enemySpawnRate = 10;
        this.enemySpawnTimerHandle = null;
        this.powerupSpawnrate = 10;
        this.powerupSpawnTimerHandle = null;
        this.seconds = 0;
        this.minutes = 0;

        this.restaring = false;
        this.isOver = false;
    }
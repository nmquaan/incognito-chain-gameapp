export default class GameData {
  static init()
  {
    var firstTime = localStorage.getItem('first_time_launch');
    this.user_moneny = 0;

    if(firstTime == null)
    {
      console.log('Init Game Data');
      localStorage.setItem('first_time_launch', 'true');
      localStorage.setItem('user_money', '5000');
    }
    
    this.user_moneny = parseInt(localStorage.getItem('user_money'));
  }
  
  // Set Best Score
  static getMoney()
  {
    return this.user_moneny;
  }

  static setMoney(money) {
    this.user_moneny = money;
    localStorage.setItem('user_money', this.user_moneny.toString());
  }
}
  
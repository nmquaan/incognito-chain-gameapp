export default class GameData {
  static init()
  {
    this._bestScore = 0;
    this._themeID = 0;
  }
  
  // Set Best Score
  static setBestScore(score)
  {
    this._bestScore = score;
  }

  static getBestScore() {
    return this._bestScore;
  }

  // Set Theme ID
  static setThemeID(id)
  {
    this._themeID = id;
  }

  static getThemeID() {
    return this._themeID;
  }
}
  
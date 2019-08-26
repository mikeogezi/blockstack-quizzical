export default class ScoreUtils {
  /**
   * Calculates the result of a quiz
   * @param {[object]} questionArray
   * @return {object} `{score, email}`
   */
  static calculateScore (questions) {
    return (questions.reduce((acc, q) => (q.correct === q.selected) ? (acc + 1) : acc, 0) / questions.length) * 100;
  }
}
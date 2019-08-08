/**
 * This script parses the question text files into JSON
 */
const fs = require('fs');
const util = require('util');
const path = require('path');
const uuid = require('uuid');

const fileNames = ['html', 'js', 'python', 'sql']
  .map(fileName => path.join('./', `${fileName}.txt`));

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const CA = 'Correct Answer';
var parseTo = async (src, dest) => {
  console.log(`From ${src} to ${dest}`);
  const contents = (await readFile(src)).toString();
  const questions = [];
  contents.split(/Question [0-9]{1,2}:/).slice(1).forEach(content => {
    const id = uuid.v4();
    // console.log(content, '\n\n');
    const lines = content.split('\n');
    // console.log(lines);
    const question = lines[1];
    let options = lines.slice(2).filter(option => !!option);
    const correct = options
      .reduce((a, b) => b.includes(CA) ? b : a, '').replace(CA, '').trim();
    if (correct === '') {
      throw new Error(`Question doesn't have a correct answer\n--> Question: "${question}"`);
    }
    options = options.map(option => option.replace(CA, '').trim());
    // console.log(options);
    questions.push({ id, question, options, correct });
    // console.log(questions);
  });
  // console.log(questions);
  await writeFile(dest, JSON.stringify(questions, null, 2));
}

fileNames.forEach(fileName => parseTo(fileName, fileName.replace('.txt', '.json')));
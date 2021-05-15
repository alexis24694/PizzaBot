module.exports = {
  getPercentage: function (startLevel, goalLevel, premiums, specials, epics, primes, piecesGoal = 1, goibhniuFlag = 0) {
    const totalSimulations = 50000;
    let successes = 0;    

    for (let i = 0; i < totalSimulations; i++)
    {          
      let piecesSucceeded = 0;
      let currentStatus = {
        level: startLevel,
        premiums: premiums,
        specials: specials,
        epics: epics,
        primes: primes
      }
      for (let j = 0; j < piecesGoal; j++){
        currentStatus.level = startLevel;
        if (attemptGoal(currentStatus, goalLevel, goibhniuFlag))
          piecesSucceeded++;
      }
      
      if (piecesSucceeded === piecesGoal)
        successes++;
    }
    return (successes /totalSimulations) * 100;
  },
  testEnhance: function(level, goibFlag = 0){
    return enhance(successRates[level - 1] + goibFlag * goibhniuRates[level - 1]);
  },

  getRuneArguments: function (args, multipleFlag = false){
    let currentRunes = {
      premiums: 0,
      specials: 0,
      epics: 0,
      primes: 0
    }    
    args = args.map(i => Number.parseInt(i));
    areAllInt = args.every(i => Number.isInteger(i));
    if (!areAllInt) throw new Error('Arguments can only be integer numbers');
    let [startLevel, endLevel] = args.slice(0,2);
    if (!startLevel || !endLevel) throw new Error('You need to specify start and end level');
    if (startLevel < 10 || startLevel > 19 || endLevel < 2 || endLevel > 20) throw new Error('Enhances must be within level 1 and 20');  
    if (startLevel >= endLevel) throw new Error('startLevel cannot be higher than end level');
    args = args.slice(2,args.length);
    runeRanges.forEach(range => {    
      if ((startLevel >= range.minLevel && startLevel < range.maxLevel) ||
        (endLevel > range.minLevel && endLevel <= range.maxLevel)){
        let runes = args.shift();
        if (!runes) throw new Error(`Missing ${range.name} quantity`);
        if (runes < 0) throw new Error(`${range.name} cannot be less than 0`);
        currentRunes[range.name] = runes;
      }   
    });
    let runesArray = Object.values(currentRunes);
    if (multipleFlag) {
      let piecesGoal = args.shift();
      if (!piecesGoal || piecesGoal < 1 || piecesGoal > 5) throw new Error('Number of pieces needs to be between 1 and 5');
      runesArray.push(piecesGoal);
    }else{
      runesArray.push(1);
    }
    let goibhniuFlag = args.shift();
    if (args.length) throw new Error(`Too many parameters : ${args}`);
    if (goibhniuFlag && goibhniuFlag !== 0 && goibhniuFlag !== 1) throw new Error('goibhniuFlag can only be 0 or 1');    
    runesArray.unshift(startLevel, endLevel);
    runesArray.push(goibhniuFlag ? goibhniuFlag : 0);
    return runesArray;
  }
};

const successRates = [1,1,1,0.95,0.9,0.85,0.8,0.75,0.7,0.65,0.6,0.55,0.45,0.4,0.35,0.3,0.225,0.175,0.1,0.05];
const goibhniuRates = [0,0,0,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.04,0.04,0.04,0.035,0.035,0.03,0.03,0.02,0.02,0.0125];
const runeRanges = [
  {
    minLevel: 10,
    maxLevel: 13,
    name: 'premiums'
  },
  {
    minLevel: 13,
    maxLevel: 15,
    name: 'specials'
  },
  {
    minLevel: 15,
    maxLevel: 18,
    name: 'epics'
  },
  {
    minLevel: 18,
    maxLevel: 20,
    name: 'primes'
  }
];

function attemptGoal(currentStatus, goalLevel, goibhniuFlag)
{
    while (currentStatus.level < goalLevel)
    {
      if (!enhanceByLevel(currentStatus, goalLevel, 'premiums', 10, 13, goibhniuFlag)) return false;
      if (!enhanceByLevel(currentStatus, goalLevel, 'specials', 13, 15, goibhniuFlag)) return false;
      if (!enhanceByLevel(currentStatus, goalLevel, 'epics', 15, 18, goibhniuFlag)) return false;
      if (!enhanceByLevel(currentStatus, goalLevel, 'primes', 18, 20, goibhniuFlag)) return false;
    }
    return true;
}

function enhanceByLevel(currentStatus, goalLevel, runeName, runeMinLevel, runeMaxLevel, goibhniuFlag){
  if (currentStatus.level < goalLevel && currentStatus.level >= runeMinLevel && currentStatus.level < runeMaxLevel)
  {
      if (currentStatus[runeName] === 0)
        return false;
      let goibhniuBonus = goibhniuFlag === 1 ? goibhniuRates[currentStatus.level] : 0;
      if (enhance(successRates[currentStatus.level] + goibhniuBonus))
        currentStatus.level++;      
      else
        currentStatus[runeName]--;      
  }
  return true;
}

function enhance(prob)
{
  return !!prob && Math.random() <= prob;
}
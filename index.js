import dayjs from 'dayjs';

const main = async () => {
  const response = await fetch(
    'https://gist.githubusercontent.com/nahuelb/0af04ce9aadab10afe2f37ba566070c2/raw/47effc9a678e9616369b56eeeb4ee54f22763b21/sessions.json'
  );

  const sessions = await response.json();

  const completedSessions = sessions.filter(
    (session) => session.isSessionCompleted
  );

  const sessionDates = completedSessions.map((session) =>
    dayjs(session.dateSession).format('YYYY/MM/DD')
  );

  const uniqueDatesSet = new Set(sessionDates);
  const uniqueDates = Array.from(uniqueDatesSet);

  const uniqueDatesSorted = uniqueDates.sort();

  //First exercise
  const userCurrentStreak = getCurrentStreak(uniqueDatesSorted);
  console.log({ userCurrentStreak });

  //Second exercise
  const userMaxStreak = getMaxStreak(uniqueDatesSorted);
  console.log({ userMaxStreak });

  //Second exercise with start date and end date
  const userMaxStreakObj = getMaxStreakObject(uniqueDatesSorted);
  console.log({ userMaxStreakObj });
};

const getCurrentStreak = (sessionDates) => {
  const now = dayjs('2022/01/25');
  const sessionDatesCopy = [...sessionDates].reverse();

  let streakDays = 0;

  for (let i = 0; i < sessionDatesCopy.length; i++) {
    if (i === 0 && now.format('YYYY/MM/DD') === sessionDatesCopy[i])
      streakDays++;

    if (i === sessionDatesCopy.length - 1) break;

    const prevSessionDay = dayjs(sessionDatesCopy[i])
      .subtract(1, 'day')
      .format('YYYY/MM/DD');

    if (prevSessionDay === sessionDatesCopy[i + 1]) {
      streakDays++;
      continue;
    }
    break;
  }

  return streakDays;
};

const getMaxStreak = (sessionDates) => {
  const now = dayjs('2022/01/25');
  const sessionDatesCopy = [...sessionDates].reverse();

  let streakDays = 0;
  let streaks = [];

  for (let i = 0; i < sessionDatesCopy.length; i++) {
    if (i === 0 && now.format('YYYY/MM/DD') === sessionDatesCopy[i])
      streakDays++;

    if (i === sessionDatesCopy.length - 1) break;

    const prevSessionDay = dayjs(sessionDatesCopy[i])
      .subtract(1, 'day')
      .format('YYYY/MM/DD');

    if (prevSessionDay === sessionDatesCopy[i + 1]) {
      streakDays++;
      continue;
    }
    streaks.push(streakDays);
    streakDays = 0;
  }

  return Math.max(...streaks);
};

const getMaxStreakObject = (sessionDates) => {
  const now = dayjs('2022/01/25');
  const sessionDatesCopy = [...sessionDates].reverse();

  let startDate;
  let streakDays = 0;

  let streaks = [];

  for (let i = 0; i < sessionDatesCopy.length; i++) {
    if (i === 0 && now.format('YYYY/MM/DD') === sessionDatesCopy[i]) {
      startDate = sessionDatesCopy[i];
      streakDays++;
    }

    if (i === sessionDatesCopy.length - 1) break;

    const prevSessionDay = dayjs(sessionDatesCopy[i])
      .subtract(1, 'day')
      .format('YYYY/MM/DD');

    if (prevSessionDay === sessionDatesCopy[i + 1]) {
      streakDays++;
      continue;
    }

    streaks.push({
      startDate,
      endDate: sessionDatesCopy[i],
      streakDays,
    });

    startDate = sessionDatesCopy[i + 1];
    streakDays = 0;
  }

  const maximun = Math.max(...streaks.map((obj) => obj.streakDays));

  return streaks.find((streak) => streak.streakDays === maximun);
};

main();

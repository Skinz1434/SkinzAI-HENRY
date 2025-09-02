export const militaryRanks = {
  Army: {
    enlisted: ['Private', 'Private First Class', 'Specialist', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Sergeant First Class', 'Master Sergeant', 'First Sergeant', 'Sergeant Major'],
    officer: ['Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General']
  },
  Navy: {
    enlisted: ['Seaman Recruit', 'Seaman Apprentice', 'Seaman', 'Petty Officer Third Class', 'Petty Officer Second Class', 'Petty Officer First Class', 'Chief Petty Officer', 'Senior Chief Petty Officer', 'Master Chief Petty Officer'],
    officer: ['Ensign', 'Lieutenant Junior Grade', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain', 'Rear Admiral (lower half)', 'Rear Admiral', 'Vice Admiral', 'Admiral']
  },
  Marines: {
    enlisted: ['Private', 'Private First Class', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Gunnery Sergeant', 'Master Sergeant', 'First Sergeant', 'Master Gunnery Sergeant', 'Sergeant Major'],
    officer: ['Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General']
  },
  'Air Force': {
    enlisted: ['Airman Basic', 'Airman', 'Airman First Class', 'Senior Airman', 'Staff Sergeant', 'Technical Sergeant', 'Master Sergeant', 'Senior Master Sergeant', 'Chief Master Sergeant'],
    officer: ['Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General']
  },
  'Space Force': {
    enlisted: ['Specialist 1', 'Specialist 2', 'Specialist 3', 'Specialist 4', 'Sergeant', 'Technical Sergeant', 'Master Sergeant', 'Senior Master Sergeant', 'Chief Master Sergeant'],
    officer: ['Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General']
  },
  'Coast Guard': {
    enlisted: ['Seaman Recruit', 'Seaman Apprentice', 'Seaman', 'Petty Officer Third Class', 'Petty Officer Second Class', 'Petty Officer First Class', 'Chief Petty Officer', 'Senior Chief Petty Officer', 'Master Chief Petty Officer'],
    officer: ['Ensign', 'Lieutenant Junior Grade', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain', 'Rear Admiral (lower half)', 'Rear Admiral', 'Vice Admiral', 'Admiral']
  }
};

export const payGrades = {
  enlisted: ['E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9'],
  officer: ['O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10']
};

export function getRankForBranch(branch: string, isOfficer: boolean = false): { rank: string; payGrade: string } {
  const branchRanks = militaryRanks[branch as keyof typeof militaryRanks];
  if (!branchRanks) {
    // Default to Army if branch not found
    const ranks = isOfficer ? militaryRanks.Army.officer : militaryRanks.Army.enlisted;
    const index = Math.floor(Math.random() * ranks.length);
    return {
      rank: ranks[index],
      payGrade: isOfficer ? payGrades.officer[index] : payGrades.enlisted[index]
    };
  }
  
  const ranks = isOfficer ? branchRanks.officer : branchRanks.enlisted;
  const index = Math.floor(Math.random() * ranks.length);
  
  return {
    rank: ranks[index],
    payGrade: isOfficer ? payGrades.officer[Math.min(index, 9)] : payGrades.enlisted[Math.min(index, 8)]
  };
}
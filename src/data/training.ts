export interface TrainingProgram {
  id: string;
  title: string;
  trainer: string;
  trainerImage: string;
  level: string;
  duration: string;
  image: string;
  rating: number;
  students: number;
}

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'tp1',
    title: 'Muscle Mass Masterclass',
    trainer: 'Giorgi Svanidze',
    trainerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    level: 'Advanced',
    duration: '12 Weeks',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    rating: 4.9,
    students: 1240,
  },
  {
    id: 'tp2',
    title: 'Fat Burn & Cardio Blast',
    trainer: 'Nino Beridze',
    trainerImage: 'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?w=200&h=200&fit=crop',
    level: 'Beginner',
    duration: '8 Weeks',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    rating: 4.8,
    students: 2150,
  },
  {
    id: 'tp3',
    title: 'Home Strength & Tone',
    trainer: 'Luka Kapanadze',
    trainerImage: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?w=200&h=200&fit=crop',
    level: 'Any Level',
    duration: '6 Weeks',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800',
    rating: 4.7,
    students: 3400,
  },
  {
    id: 'tp4',
    title: 'Functional Fitness Pro',
    trainer: 'Davti Gelashvili',
    trainerImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop',
    level: 'Intermediate',
    duration: '10 Weeks',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    rating: 4.8,
    students: 850,
  },
  {
    id: 'tp5',
    title: 'Yoga for Mobility',
    trainer: 'Mariam Dolidze',
    trainerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    level: 'Beginner',
    duration: '4 Weeks',
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800',
    rating: 4.9,
    students: 4200,
  },
  {
    id: 'tp6',
    title: 'Powerlifting Basics',
    trainer: 'Levan Saginashvili',
    trainerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    level: 'Expert',
    duration: '16 Weeks',
    image: 'https://images.unsplash.com/photo-1574680096141-1cddd32e01f5?w=800',
    rating: 5.0,
    students: 600,
  },
  {
    id: 'tp7',
    title: 'CrossFit Intensive',
    trainer: 'Alex Todua',
    trainerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    level: 'High Intensity',
    duration: '8 Weeks',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed6818088?w=800',
    rating: 4.6,
    students: 1500,
  },
  {
    id: 'tp8',
    title: 'Calisthenics Mastery',
    trainer: 'Sandro Maysuradze',
    trainerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    level: 'Advanced',
    duration: '12 Weeks',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800',
    rating: 4.8,
    students: 2300,
  },
];

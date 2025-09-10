const educationalContent = {
  en: [
    {
      id: 1,
      title: "First Trimester Care",
      content: "Essential care during your first 12 weeks of pregnancy",
      category: "prenatal",
      week: "1-12"
    },
    {
      id: 2,
      title: "Nutrition During Pregnancy",
      content: "Important nutrients for you and your baby",
      category: "nutrition",
      week: "all"
    }
  ],
  tw: [
    {
      id: 1,
      title: "Nyinsɛn Mfiase Hwɛ",
      content: "Nneɛma a ɛho hia wɔ nyinsɛn nnawɔtwe 12 a edi kan no mu",
      category: "prenatal",
      week: "1-12"
    }
  ]
};

export const getEducationalResources = async (req, res, next) => {
  try {
    const { language = 'en', category, week } = req.query;
    
    let resources = educationalContent[language] || educationalContent.en;
    
    if (category) {
      resources = resources.filter(r => r.category === category);
    }
    
    if (week) {
      resources = resources.filter(r => r.week === 'all' || r.week === week);
    }

    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};
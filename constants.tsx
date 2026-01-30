
import { Lesson, LibraryItem } from './types';

export const UNITS_METADATA = [
  { id: 'U1', title: { ar: 'مبادئ الحوكمة الرشيدة', en: 'Good Governance Principles' } },
  { id: 'U2', title: { ar: 'الشفافية والوصول إلى المعلومات', en: 'Transparency & Access to Info' } },
  { id: 'U3', title: { ar: 'آليات المساءلة المجتمعية', en: 'Social Accountability' } },
  { id: 'U4', title: { ar: 'توثيق الوقائع المدنية في سوريا', en: 'Civil Documentation in Syria' } },
  { id: 'U5', title: { ar: 'حقوق المرأة واتفاقية سيداو (CEDAW)', en: 'Women’s Rights & CEDAW' } },
  { id: 'U6', title: { ar: 'الإعلان العالمي لحقوق الإنسان', en: 'Universal Declaration of HR' } },
  { id: 'U7', title: { ar: 'تحليل النزاعات المحلية وبناء السلام', en: 'Conflict Analysis & Peace' } },
  { id: 'U8', title: { ar: 'أخلاقيات العمل العام والتطوعي', en: 'Public & Volunteer Ethics' } },
  { id: 'U9', title: { ar: 'حقوق الملكية والسكن والأرض (HLP)', en: 'Housing Land Property (HLP)' } },
  { id: 'U10', title: { ar: 'مهارات الحوار والوساطة', en: 'Dialogue & Mediation Skills' } },
  { id: 'U11', title: { ar: 'المواطنة الرقمية والحوكمة الإلكترونية', en: 'Digital Citizenship & E-Gov' } },
  { id: 'U12', title: { ar: 'الإدارة البيئية والسياسة المحلية', en: 'Environmental Admin & Policy' } },
  { id: 'U13', title: { ar: 'العدالة الاجتماعية والمساواة', en: 'Social Justice & Equality' } },
  { id: 'U14', title: { ar: 'قيادة الشباب والإرشاد المجتمعي', en: 'Youth Leadership & Mentorship' } },
  { id: 'U15', title: { ar: 'منظمات المجتمع المدني وأدوارها', en: 'Civil Society Organizations' } },
  { id: 'U16', title: { ar: 'إدارة الكوارث والمرونة المجتمعية', en: 'Disaster Mgt & Resilience' } },
  { id: 'U17', title: { ar: 'مراقبة الموازنة والتدقيق الاجتماعي', en: 'Budget Monitoring & Social Audit' } },
  { id: 'U18', title: { ar: 'حرية التعبير والوعي الإعلامي', en: 'Freedom of Expression & Media' } },
  { id: 'U19', title: { ar: 'نماذج اللامركزية الإدارية', en: 'Administrative Decentralization' } },
  { id: 'U20', title: { ar: 'حقوق الإنسان في بيئة العمل', en: 'Human Rights in the Workplace' } },
];

const getDetailedLesson = (unitId: string, unitName: string, lessonIndex: number): Lesson => {
  const categories = {
    U1: 'governance', U2: 'transparency', U3: 'accountability',
    U4: 'documentation', U5: 'rights', U6: 'rights',
    U7: 'peacebuilding', U8: 'ethics', U9: 'hlp', U10: 'mediation',
    U11: 'digital', U12: 'environment', U13: 'justice', U14: 'youth',
    U15: 'csos', U16: 'resilience', U17: 'budget', U18: 'media',
    U19: 'decentralization', U20: 'workplace'
  };

  const titles = [
    `مفاهيم أساسية ومعايير دولية في ${unitName}`,
    `الواقع العملي والتحديات الميدانية في ${unitName}`,
    `الأدوات الابتكارية لتعزيز ${unitName}`,
    `دراسة حالة معمقة: ممارسات ناجحة في ${unitName}`,
    `خارطة طريق لتفعيل ${unitName} في مجتمعك`
  ];

  const sectionsByUnit: Record<string, string[]> = {
    U1: [
      "الحوكمة الرشيدة ليست مجرد مصطلح إداري، بل هي عقد اجتماعي يضمن توزيعاً عادلاً للموارد والفرص.",
      "تتضمن المعايير الدولية للحوكمة ثمانية مبادئ أساسية: المشاركة، سيادة القانون، الشفافية، الاستجابة، التوافق، العدالة، الكفاءة، والمساءلة.",
      "في السياق المحلي، تعني الحوكمة قدرة المجالس المحلية على تقديم الخدمات الأساسية دون تمييز أو محسوبية.",
      "تمثل الشفافية العمود الفقري للحوكمة، حيث لا يمكن تحقيق المساءلة بدون تدفق حر للمعلومات الدقيقة للمواطنين.",
      "أكبر عائق أمام الحوكمة هو الفساد الإداري، والذي يبدأ غالباً من غياب المعايير الواضحة في التوظيف والتلزيم."
    ],
    U2: [
      "الوصول إلى المعلومات هو حق إنساني أساسي يمكّن المواطنين من ممارسة حقوقهم الأخرى بوعي.",
      "تتطلب الشفافية نشر الميزانيات، العقود العامة، ونتائج المشاريع بشكل دوري ومبسط للعامة.",
      "المعلومات المفتوحة تقلل من الإشاعات وتبني جسور الثقة بين المؤسسة والمجتمع المحلي.",
      "يجب أن تكون آليات طلب المعلومات سهلة، سريعة، ومجانية لضمان شمولية الوصول للجميع.",
      "التحدي الأكبر يكمن في ثقافة 'السرية' التي قد تتبناها بعض الجهات لتهرب من الرقابة الشعبية."
    ],
    U3: [
      "المساءلة المجتمعية هي عملية تفاعلية يقوم فيها المواطنون بمراقبة أداء مقدمي الخدمات.",
      "تتنوع أدوات المساءلة بين بطاقات تقييم المجتمع، جلسات الاستماع العلنية، والتدقيق الاجتماعي للمشاريع.",
      "الهدف من المساءلة ليس العقاب، بل تحسين جودة الخدمة وضمان وصولها للفئات الأكثر احتياجاً.",
      "تنجح المساءلة عندما تتوفر إرادة سياسية للاستجابة ومواطنون واعون بحقوقهم ويمتلكون مهارات الرصد.",
      "يجب حماية المبلّغين عن التقصير لضمان استمرارية الرقابة الشعبية دون خوف من التبعات."
    ],
    U4: [
      "التوثيق المدني هو الضمانة القانونية لهوية الفرد وحقوقه في الميراث، التعليم، والرعاية الصحية.",
      "في سوريا، تسببت سنوات النزاع في فقدان الكثيرين لوثائقهم أو تسجيل وقائعهم خارج المؤسسات الرسمية.",
      "يعد تثبيت الزواج والولادات الخطوة الأولى لاسترداد الحقوق القانونية للأطفال وحمايتهم من انعدام الجنسية.",
      "الحلول القانونية المتاحة تشمل دعاوى تثبيت النسب والإجراءات الإدارية المتأخرة لتسجيل الوقائع.",
      "الوعي القانوني بأهمية السجل المدني يحمي الأجيال القادمة من الضياع القانوني والاجتماعي."
    ],
    U11: [
      "المواطنة الرقمية تعني استخدام التكنولوجيا بمسؤولية وأخلاق للمشاركة في الحياة العامة.",
      "الحوكمة الإلكترونية تسهل الوصول للخدمات وتقلل من احتمالات الفساد عبر أتمتة الإجراءات.",
      "يجب حماية البيانات الشخصية للمواطنين كجزء أساسي من الأمان الرقمي في الإدارة المحلية.",
      "الفجوة الرقمية قد تؤدي لتهميش الفئات التي لا تمتلك التكنولوجيا, لذا يجب توفير بدائل مادية.",
      "تساهم المنصات التفاعلية في جمع آراء المواطنين حول المشاريع المحلية بسرعة وفعالية."
    ],
    U18: [
      "حرية التعبير هي ركيزة الديمقراطية، لكنها ترتبط بمسؤولية أخلاقية تجاه الحقيقة والسلم الأهلي.",
      "الوعي الإعلامي يمكن المواطن من تمييز الأخبار المضللة وخطاب الكراهية الذي يهدد المجتمع.",
      "الصحافة المحلية المستقلة تلعب دور الرقيب على أداء المؤسسات الخدمية في المناطق.",
      "يجب توفير بيئة آمنة للصحفيين والمدنيين للتعبير عن آرائهم دون خوف من الملاحقة.",
      "الاستخدام الواعي لوسائل التواصل الاجتماعي يحولها من أدوات للنزاع إلى منصات للبناء والتنمية."
    ]
  };

  const defaultSections = [
    `تعتبر ${unitName} جزءاً لا يتجزأ من مسيرة التنمية المستدامة وبناء السلام في المجتمعات المحلية.`,
    "يتطلب النجاح in هذا المجال تضافر جهود المجتمع المدني مع الجهات الإدارية المحلية.",
    "إن تبني قيم النزاهة والعمل الجماعي يقلل من تكلفة المشاريع ويزيد من أثرها الإيجابي.",
    "الابتكار في استخدام الموارد المتاحة هو مفتاح التغلب على التحديات الاقتصادية واللوجستية.",
    "التوثيق المستمر والتقييم الدوري هما ما يضمن استمرارية النجاح وتجنب تكرار الأخطاء."
  ];

  return {
    id: `${unitId}L${lessonIndex + 1}`,
    unitId,
    level: lessonIndex < 2 ? 'basic' : lessonIndex < 4 ? 'advanced' : 'ToT',
    category: categories[unitId as keyof typeof categories] || 'general',
    duration: lessonIndex < 2 ? '15 min' : '25 min',
    duration_min: lessonIndex < 2 ? 15 : 25,
    title: { ar: titles[lessonIndex], en: titles[lessonIndex] },
    learning_outcomes: [
      `تحليل المفاهيم العميقة المرتبطة بـ ${unitName}`,
      `تحديد الأدوات العملية لتطبيق ${unitName} ميدانياً`,
      `تقييم التحديات القانونية والاجتماعية في بيئة العمل`,
      `تصميم مبادرة مصغرة لتفعيل ${unitName} في الحي`,
      `تطوير مهارات التيسير لتعليم ${unitName} للآخرين`
    ],
    sections: sectionsByUnit[unitId] || defaultSections,
    scenario: `في منطقتك، واجهت اللجنة المحلية تحدياً يتعلق بـ ${unitName}، حيث انقسم الناس بين مؤيد ومعارض. بصفتك شخصاً خبيراً تعلم مبادئ هذا الدرس، كيف ستقوم بتيسير حوار بنّاء يهدف للوصول إلى حل توافقي يرضي الجميع ويحفظ المصلحة العامة؟`,
    questions: [
      {
        type: 'mcq',
        text: "ما هو الشرط الأساسي لضمان استدامة هذه الممارسات؟",
        options: ["التمويل الخارجي الكبير", "المشاركة الشعبية والشفافية التامة", "المركزية المطلقة في القرار", "تجاهل الشكاوى البسيطة"],
        correct_index: 1,
        explanation: "المشاركة والشفافية تخلقان شعوراً بالملكية لدى المجتمع، مما يضمن حماية المشاريع واستدامتها."
      },
      {
        type: 'truefalse',
        text: "لا يمكن تطبيق مبادئ الحوكمة في ظروف النزاع أو نقص الموارد.",
        correct: false,
        explanation: "بالعكس، تزداد الحاجة للحوكمة في ظروف النزاع لضمان التوزيع العادل للموارد المحدودة ومنع استغلالها."
      },
      {
        type: 'mcq',
        text: "كيف تساهم الشفافية في تقليل النزاعات؟",
        options: ["عن طريق إخفاء المعلومات الحساسة", "بوضوح المعايير وتكافؤ الفرص أمام الجميع", "بإصدار قرارات دون تفسير", "بتقليل دور المواطن في الرقابة"],
        correct_index: 1,
        explanation: "عندما يعرف الجميع المعايير التي اتُخذ بها القرار، يقل الشعور بالظلم والتحيز."
      }
    ],
    reflection: { 
      ar: [
        "كيف يمكن لهذا المفهوم أن يغير واقع تقديم الخدمات في شارعك؟",
        "ما هي الخطوة الأولى التي يمكنك اتخاذها غداً لتكون ممارساً حقيقياً لهذه القيم؟",
        "هل ترى تعارضاً بين التقاليد المحلية وهذه المبادئ الدولية؟ وكيف تعالج ذلك؟"
      ], 
      en: [
        "How can this concept change service delivery in your street?",
        "What is the first step you can take tomorrow to be a true practitioner?",
        "Do you see conflict between local traditions and these principles?"
      ] 
    },
    mini_task: { 
      title: "تحدي المبادرة الذكية", 
      steps: [
        "حدد مشكلة بسيطة في حيك تتعلق بموضوع الدرس.",
        "اجلس مع شخصين من جيرانك وناقش معهم الحلول بناءً على ما تعلمت.",
        "وثّق اقتراحك للحل في مسودة بسيطة وارسلها لمجلس الحي أو اللجنة المحلية."
      ], 
      evidence: "مسودة اقتراح أو صورة من اللقاء المجتمعي." 
    }
  };
};

export const LESSONS_DATA: Lesson[] = UNITS_METADATA.flatMap(unit => 
  [0, 1, 2, 3, 4].map(index => getDetailedLesson(unit.id, unit.title.ar, index))
);

export const LIBRARY_DATA: LibraryItem[] = [
  {
    id: 'lib1',
    type: 'manual',
    title: { ar: 'الدليل المرجعي الوطني للحوكمة المحلية', en: 'National Ref Guide for Local Gov' },
    description: { ar: 'دليل شامل يجمع كافة القوانين والمعايير الدولية والمحلية لإدارة شؤون المجتمع بفعالية.', en: 'Comprehensive guide gathering all laws and international standards for community mgt.' },
    content: {
      ar: [
        "أولاً: القيم الأخلاقية للإدارة العامة - ترتكز الإدارة المحلية الناجحة على قيم النزاهة، الحياد، والالتزام بخدمة المواطن كأولوية قصوى. يجب على كل موظف عام الحفاظ على موارد المجتمع كأمانة وطنية.",
        "ثانياً: الإطار القانوني السوري - يستند هذا الدليل إلى قانون الإدارة المحلية رقم 107، والذي يهدف إلى تحقيق اللامركزية في السلطات والمسؤوليات، وتركيزها في أيدي وحدات إدارية قادرة على تلبية احتياجات المواطنين بكفاءة.",
        "ثالثاً: الموازنة التشاركية - هي عملية يقرر فيها أفراد المجتمع كيفية إنفاق جزء من الموازنة العامة. تبدأ بعقد جلسات استماع لتحديد الاحتياجات، تليها عملية التصويت الشعبي على المشاريع ذات الأولوية لضمان الشفافية.",
        "رابعاً: أدوات الوصول للمعلومات - يحق للمواطن الاطلاع على قرارات المجالس المحلية، كشوف الحسابات الختامية، ومحاضر الجلسات. يتم ذلك عبر لوحات الإعلانات الرسمية أو البوابات الإلكترونية المخصصة.",
        "خامساً: مبادئ العدالة في تقديم الخدمة - يجب تقديم الخدمات الأساسية (مياه، كهرباء، نظافة) بناءً على معايير فنية واحتياجات فعلية، مع استبعاد أي شكل من أشكال التمييز القائم على الانتماء أو المكانة الاجتماعية."
      ],
      en: [
        "I. Ethical Foundations: Successful local admin rests on integrity, neutrality, and citizen service. Public resources must be guarded as a national trust.",
        "II. Legal Framework: Based on Law 107, aiming for decentralization and empowering local units to meet citizen needs efficiently.",
        "III. Participatory Budgeting: Community members decide how to spend part of the budget through consultation and public voting on priorities.",
        "IV. Access to Information: Citizens have the right to view council decisions and accounts via official boards or digital portals.",
        "V. Equality in Service: Essential services must be provided based on technical criteria and actual needs, avoiding any discrimination."
      ]
    }
  },
  {
    id: 'lib2',
    type: 'guide',
    title: { ar: 'دليل الوساطة المجتمعية وحل النزاعات', en: 'Community Mediation & Conflict Res' },
    description: { ar: 'منهجية عملية لتدريب الوسطاء المحليين على حل النزاعات العقارية والخدمية والاجتماعية.', en: 'Practical methodology for training local mediators on resolving land and social conflicts.' },
    content: {
      ar: [
        "المرحلة الأولى: فهم جذور النزاع - يجب على الوسيط تحديد الأطراف الفاعلة، والتمييز بين المواقف المعلنة والاحتياجات الحقيقية الدفينة. استخدام 'شجرة النزاع' يساعد في تحديد الأسباب والآثار.",
        "المرحلة الثانية: التواصل غير العنيف - التركيز على لغة الاحتياجات بدلاً من لغة الاتهامات. يجب على الوسيط تشجيع الأطراف على التعبير عن مشاعرهم وتوقعاتهم بوضوح ودون تجريح.",
        "المرحلة الثالثة: العصف الذهني للحلول - في هذه المرحلة، يتم تشجيع الأطراف على طرح أكبر قدر ممكن من الحلول المبتكرة دون إصدار أحكام مسبقة عليها، حتى نصل إلى منطقة 'الربح المشترك'.",
        "المرحلة الرابعة: صياغة اتفاق الصلح - يجب أن يكون الاتفاق مكتوباً، واضحاً، محدداً بزمن، وقابلاً للتنفيذ. يفضل توثيق الاتفاق لدى الوجهاء أو الجهات القانونية لضمان الالتزام به.",
        "المرحلة الخامسة: المتابعة والتقييم - لا تنتهي مهمة الوسيط بانتهاء الجلسة، بل يجب عليه متابعة تنفيذ بنود الصلح لضمان عدم تجدد النزاع وبناء الثقة المستدامة."
      ],
      en: [
        "Stage 1: Identifying Roots - Mediators must distinguish between stated positions and underlying needs using tools like the 'Conflict Tree'.",
        "Stage 2: Non-Violent Communication - Focus on needs rather than blame, encouraging clear and respectful expression of expectations.",
        "Stage 3: Brainstorming Solutions - Encourage parties to suggest innovative solutions without judgment to reach 'Win-Win' outcomes.",
        "Stage 4: Drafting the Agreement - Agreements must be written, clear, time-bound, and enforceable, ideally documented by legal or social entities.",
        "Stage 5: Follow-up - Mediators follow up on implementation to ensure compliance and prevent conflict recurrence."
      ]
    }
  },
  {
    id: 'lib3',
    type: 'template',
    title: { ar: 'مجموعة قوالب الرقابة والتقييم', en: 'M&E Template Collection' },
    description: { ar: 'مجموعة من القوالب الجاهزة لرصد أداء المشاريع المحلية وجمع شكاوى المواطنين وتصنيفها.', en: 'Collection of templates for monitoring project performance and categorizing complaints.' },
    content: {
      ar: [
        "1. قالب بطاقة تقييم الخدمة: أداة تسمح للمواطن بتقييم جودة المياه أو النظافة بناءً على معايير (الانتظام، الجودة، السلوك). يتم تحليل هذه البيانات شهرياً لتحسين الأداء.",
        "2. نموذج سجل الشكاوى: يشمل بيانات المشتكي، موضوع الشكوى، التاريخ، والإجراء المتخذ. يضمن هذا السجل حق المواطن في المساءلة وحق المؤسسة في تصحيح المسار.",
        "3. مصفوفة تتبع مؤشرات الأداء (KPIs): جدول يربط بين الأهداف المخطط لها والنتائج المحققة فعلياً على الأرض، مع توضيح أسباب الانحرافات إن وجدت.",
        "4. نموذج تقرير الرصد الميداني: يستخدمه الميسرون المجتمعيون لتوثيق مشاهداتهم حول تنفيذ المشاريع الخدمية ومدى التزام المتعهدين بالمعايير الفنية والجداول الزمنية.",
        "5. استمارة تقييم الأثر النهائي: تهدف لقياس التغيير طويل الأمد الذي أحدثه المشروع في حياة الناس، وما إذا كان قد ساهم فعلياً في تعزيز الاستقرار المجتمعي."
      ],
      en: [
        "1. Service Scorecard: Allows citizens to rate services (Water, Trash) based on quality and regularity for performance improvement.",
        "2. Complaint Log: Tracks complainant data, subject, and actions taken, ensuring accountability and process correction.",
        "3. KPI Tracking Matrix: Links planned goals with actual field results, explaining any deviations found.",
        "4. Field Monitoring Report: Used by community facilitators to document project progress and contractor compliance with technical standards.",
        "5. Impact Assessment Form: Measures long-term changes caused by projects and their contribution to community stability."
      ]
    }
  },
  {
    id: 'lib4',
    type: 'manual',
    title: { ar: 'كتيب الأمان الرقمي للنشطاء المدنيين', en: 'Digital Security Handbook for Activists' },
    description: { ar: 'أدلة تطبيقية لحماية البيانات، الخصوصية عبر الإنترنت، وتأمين قنوات التواصل المجتمعي.', en: 'Practical guides for data protection, online privacy, and securing community communication.' },
    content: {
      ar: [
        "1. تأمين الحسابات: استخدام التحقق بخطوتين (2FA) وتطبيقات إدارة كلمات المرور يعتبر الخط الدفاعي الأول ضد الاختراقات.",
        "2. التشفير الطرفي: يوصى باستخدام تطبيقات مثل Signal للتواصل الحساس لضمان عدم اطلاع أي طرف ثالث على محتوى الرسائل.",
        "3. الخصوصية في الميدان: كيفية مسح البيانات الحساسة من الأجهزة قبل عبور نقاط التفتيش أو في حالات الطوارئ.",
        "4. مواجهة التضليل الرقمي: أدوات التحقق من الصور والفيديوهات لضمان عدم الانجرار وراء الإشاعات التي تثير الفتن.",
        "5. حماية البيانات الميدانية: بروتوكولات تخزين قوائم المستفيدين والبيانات القانونية على سحب مشفرة بعيداً عن الوصول المادي."
      ],
      en: [
        "1. Account Security: Using 2FA and password managers is the first line of defense against hacking.",
        "2. End-to-End Encryption: Recommended use of apps like Signal for sensitive communication.",
        "3. Field Privacy: How to wipe sensitive data before checkpoints or in emergencies.",
        "4. Countering Misinformation: Tools for verifying photos and videos to avoid spreading rumors.",
        "5. Data Protection: Protocols for storing beneficiary lists and legal data on encrypted clouds."
      ]
    }
  },
  {
    id: 'lib5',
    type: 'manual',
    title: { ar: 'شرح قانون الإدارة المحلية السوري 107', en: 'Syrian Local Admin Law 107 Manual' },
    description: { ar: 'تبسيط قانوني لمواد القانون رقم 107 وتوضيح صلاحيات المجالس المحلية والوحدات الإدارية.', en: 'Legal simplification of Law 107 clarifying local council powers and admin units.' },
    content: {
      ar: [
        "الفصل الأول: الشخصية الاعتبارية - يمنح القانون الوحدات الإدارية استقلالاً مالياً وإدارياً مما يتيح لها التعاقد والتقاضي باسمها الخاص.",
        "الفصل الثاني: الموارد المالية - يوضح القانون مصادر تمويل المجالس من الضرائب المحلية، حصص الموازنة العامة، والهبات المشروطة.",
        "الفصل الثالث: الرقابة الشعبية - يشرح الآليات القانونية التي تتيح للمواطنين حضور الجلسات وتقديم الطعون في قرارات المجلس.",
        "الفصل الرابع: صلاحيات المكتب التنفيذي - تفصيل المهام اليومية في إدارة قطاعات الصحة، التعليم، والخدمات الفنية.",
        "الفصل الخامس: العلاقة مع السلطة المركزية - حدود التدخل الوزاري وحالات حل المجالس المحلية وإجراءات الانتخابات التعويضية."
      ],
      en: [
        "Chapter 1: Legal Personality - Grants units financial and admin independence for contracting and litigation.",
        "Chapter 2: Financial Resources - Details funding from local taxes, state budget shares, and conditioned grants.",
        "Chapter 3: Public Oversight - Explains mechanisms for citizens to attend meetings and challenge council decisions.",
        "Chapter 4: Executive Office Powers - Daily tasks in health, education, and technical service sectors.",
        "Chapter 5: Central Relationship - Limits of ministerial intervention and procedures for council dissolution."
      ]
    }
  },
  {
    id: 'lib6',
    type: 'guide',
    title: { ar: 'دليل التخطيط الاستراتيجي للمبادرات', en: 'Strategic Planning for Initiatives' },
    description: { ar: 'منهجية تحويل الأفكار المجتمعية إلى مشاريع مستدامة ذات أثر ملموس وقابل للقياس.', en: 'Methodology for turning community ideas into sustainable projects with measurable impact.' },
    content: {
      ar: [
        "المرحلة 1: تحليل سوات (SWOT) - تحديد نقاط القوة والضعف الداخلية، والفرص والتهديدات الخارجية للمبادرة.",
        "المرحلة 2: صياغة الرؤية والمهمة - تحديد 'لماذا نوجد؟' و 'ماذا نريد أن نحقق؟' بعبارات ملهمة وواضحة.",
        "المرحلة 3: الأهداف الذكية (SMART) - صياغة أهداف محددة، قابلة للقياس، يمكن تحقيقها، ذات صلة، ومحددة زمنياً.",
        "المرحلة 4: تصميم خطة العمل - توزيع الأدوار والمسؤوليات، وتحديد الموارد اللازمة لكل نشاط.",
        "المرحلة 5: استراتيجية الاستدامة - كيف سيستمر المشروع بعد انتهاء التمويل الأولي؟ (الاعتماد على الموارد المحلية)."
      ],
      en: [
        "Stage 1: SWOT Analysis - Identifying internal strengths/weaknesses and external opportunities/threats.",
        "Stage 2: Vision & Mission - Defining core purpose and desired future in clear, inspiring terms.",
        "Stage 3: SMART Goals - Creating goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.",
        "Stage 4: Action Plan - Distributing roles and identifying resources needed for each activity.",
        "Stage 5: Sustainability Strategy - How the project continues after initial funding ends."
      ]
    }
  },
  {
    id: 'lib7',
    type: 'template',
    title: { ar: 'حقيبة أدوات توثيق حقوق الإنسان', en: 'Human Rights Documentation Toolkit' },
    description: { ar: 'نماذج احترافية لتوثيق الانتهاكات، جمع الشهادات، وحفظ الأدلة وفق المعايير الدولية.', en: 'Professional templates for documenting violations, gathering testimonies, and preserving evidence.' },
    content: {
      ar: [
        "1. استمارة مقابلة الضحايا: تضمن جمع البيانات الأساسية مع مراعاة الحالة النفسية والخصوصية والأمان.",
        "2. نموذج الموافقة المستنيرة: وثيقة قانونية تضمن موافقة الضحية على استخدام شهادتها في التقارير الدولية.",
        "3. بروتوكول حفظ الأدلة الرقمية: خطوات تقنية لضمان عدم العبث بالصور والفيديوهات لتكون صالحة في المحاكم.",
        "4. مصفوفة تتبع الانتهاكات: جدول لتصنيف الحوادث حسب نوع الحق المنتهك (سكن، تعليم، حياة).",
        "5. دليل الإحالة القانونية: قائمة بالجهات التي يمكن إحالة الضحايا إليها للحصول على دعم قانوني أو طبي عاجل."
      ],
      en: [
        "1. Victim Interview Form: Ensures basic data collection while respecting mental health and safety.",
        "2. Informed Consent Template: Legal document ensuring victim approval for using testimonies in reports.",
        "3. Digital Evidence Protocol: Technical steps to ensure photos/videos remain valid for court usage.",
        "4. Violation Tracking Matrix: Categorizing incidents by rights violated (housing, education, life).",
        "5. Legal Referral Guide: List of entities for victim legal or medical support."
      ]
    }
  },
  {
    id: 'lib8',
    type: 'guide',
    title: { ar: 'دليل الحوكمة الشاملة: حقوق ذوي الإعاقة', en: 'Inclusive Governance: Disability Rights' },
    description: { ar: 'كيفية جعل الخدمات والمؤسسات المحلية متاحة وشاملة لجميع فئات المجتمع دون استثناء.', en: 'How to make local services and institutions accessible and inclusive for all community groups.' },
    content: {
      ar: [
        "أولاً: مفهوم الدمج المجتمعي - الانتقال من منطق 'الإحسان' إلى منطق 'الحقوق' والواجبات المتساوية.",
        "ثانياً: التيسير المادي - معايير الوصول للمباني العامة (ممرات الكراسي، الإشارات البصرية، ترجمة الإشارة).",
        "ثالثاً: المشاركة في القرار - ضمان تمثيل ذوي الإعاقة في لجان الحي والمجالس المحلية ليعبروا عن احتياجاتهم.",
        "رابعاً: الحماية من التمييز - آليات الإبلاغ عن حالات الحرمان من الخدمة بسبب الإعاقة.",
        "خامساً: التوعية المجتمعية - حملات لتغيير الصور النمطية السلبية وتعزيز ثقافة التنوع في العمل العام."
      ],
      en: [
        "I. Social Inclusion Concept - Moving from a 'charity' mindset to a 'rights' and 'duties' mindset.",
        "II. Physical Accessibility - Standards for public buildings (ramps, visual signs, sign language).",
        "III. Decisional Participation - Ensuring representation in neighborhood committees and councils.",
        "IV. Non-Discrimination - Reporting mechanisms for service denial based on disability.",
        "V. Community Awareness - Campaigns to change negative stereotypes and promote diversity."
      ]
    }
  }
];

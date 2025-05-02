
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // в минутах
  category: string;
  image: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  image: string;
  services: string[]; // id услуг, которые может выполнять мастер
  workDays: number[]; // 0 - воскресенье, 1 - понедельник и т.д.
  workHours: {
    start: string; // формат "HH:MM"
    end: string; // формат "HH:MM"
  };
}

// Категории услуг
export const serviceCategories: ServiceCategory[] = [
  { id: "haircuts", name: "Стрижки" },
  { id: "coloring", name: "Окрашивание" },
  { id: "styling", name: "Укладка" },
  { id: "treatments", name: "Уходовые процедуры" },
  { id: "extensions", name: "Наращивание" },
  { id: "mens", name: "Мужской зал" }
];

// Список услуг
export const services: Service[] = [
  {
    id: "haircut-women",
    title: "Женская стрижка",
    description: "Профессиональная стрижка с учетом структуры волос, формы лица и индивидуальных пожеланий. Включает мытье головы и укладку.",
    price: 2500,
    duration: 60,
    category: "haircuts",
    image: "https://images.unsplash.com/photo-1560869713-7d9bdfd73f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "haircut-men",
    title: "Мужская стрижка",
    description: "Стильная мужская стрижка с учетом индивидуальных особенностей. Включает мытье головы и укладку.",
    price: 1800,
    duration: 45,
    category: "mens",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coloring-single",
    title: "Окрашивание в один тон",
    description: "Профессиональное окрашивание волос. Включает мытье головы, окрашивание и укладку.",
    price: 4500,
    duration: 120,
    category: "coloring",
    image: "https://images.unsplash.com/photo-1596178060810-72660ee8a9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "balayage",
    title: "Балаяж",
    description: "Техника окрашивания, создающая плавный переход от темных корней к светлым кончикам. Включает мытье головы и укладку.",
    price: 7500,
    duration: 180,
    category: "coloring",
    image: "https://images.unsplash.com/photo-1605497788044-5a32bc41ba77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "styling",
    title: "Укладка",
    description: "Профессиональная укладка для любого случая. Включает мытье головы и стайлинг.",
    price: 1800,
    duration: 45,
    category: "styling",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "treatment-mask",
    title: "Глубокое питание",
    description: "Восстанавливающая процедура для сухих и поврежденных волос. Включает маску, массаж головы и укладку.",
    price: 2200,
    duration: 60,
    category: "treatments",
    image: "https://images.unsplash.com/photo-1630116256003-130a4ad5bee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "extensions",
    title: "Наращивание волос",
    description: "Профессиональное наращивание волос с использованием качественных материалов.",
    price: 15000,
    duration: 240,
    category: "extensions",
    image: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "beard-trim",
    title: "Моделирование бороды",
    description: "Профессиональное моделирование бороды с учетом индивидуальных особенностей лица.",
    price: 1200,
    duration: 30,
    category: "mens",
    image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

// Персонал
export const staffMembers: Staff[] = [
  {
    id: "stylist-1",
    name: "Анна Петрова",
    position: "Стилист-колорист",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    services: ["haircut-women", "coloring-single", "balayage", "styling", "treatment-mask"],
    workDays: [1, 2, 3, 4, 5], // Пн-Пт
    workHours: {
      start: "10:00",
      end: "19:00"
    }
  },
  {
    id: "stylist-2",
    name: "Иван Соколов",
    position: "Барбер",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    services: ["haircut-men", "beard-trim"],
    workDays: [1, 2, 3, 5, 6], // Пн, Вт, Ср, Пт, Сб
    workHours: {
      start: "11:00",
      end: "20:00"
    }
  },
  {
    id: "stylist-3",
    name: "Елена Смирнова",
    position: "Мастер по наращиванию",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    services: ["haircut-women", "styling", "extensions"],
    workDays: [2, 3, 4, 5, 6], // Вт-Сб
    workHours: {
      start: "09:00",
      end: "18:00"
    }
  },
  {
    id: "stylist-4",
    name: "Мария Иванова",
    position: "Старший стилист",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    services: ["haircut-women", "coloring-single", "balayage", "styling", "treatment-mask"],
    workDays: [1, 3, 4, 6, 0], // Пн, Ср, Чт, Сб, Вс
    workHours: {
      start: "10:00",
      end: "19:00"
    }
  }
];

// Функция для получения сервиса по ID
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

// Функция для получения мастера по ID
export const getStaffById = (id: string): Staff | undefined => {
  return staffMembers.find(staff => staff.id === id);
};

// Функция для получения услуг по категории
export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter(service => service.category === categoryId);
};

// Функция для получения мастеров, которые выполняют определенную услугу
export const getStaffForService = (serviceId: string): Staff[] => {
  return staffMembers.filter(staff => staff.services.includes(serviceId));
};

// Функция для преобразования минут в формат часы:минуты
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} мин.`;
  } else if (mins === 0) {
    return `${hours} ч.`;
  } else {
    return `${hours} ч. ${mins} мин.`;
  }
};

// Функция для форматирования цены
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} ₽`;
};

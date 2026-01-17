using System;

class Payment
{
    public static readonly double tax = 0.13;
    public static readonly double pens_tax = 0.01;

    public string Name { get; set; }
    public string SurName { get; set; }
    public string Pa_FIO { get; set; }
    public double Salary { get; set; }
    public int Ent_years { get; set; }
    public int Quanity_moth_day_worked { get; set; }
    public int Quanity_moth_day { get; set; }
    public double Premium { get; set; }

    public Payment(double premium, string name, string surName, string paFIO,
                   double salary, int entYears, int workedDays, int totalWorkDays)
    {
        Premium = premium;
        Name = name;
        SurName = surName;
        Pa_FIO = paFIO;
        Salary = salary;
        Ent_years = entYears;
        Quanity_moth_day_worked = workedDays;
        Quanity_moth_day = totalWorkDays;
    }

    public double Calculator_Salary()
    {
        if (Quanity_moth_day <= 0)
        {
            return 0;
        }
        return (Salary / Quanity_moth_day) * Quanity_moth_day_worked;
    }

    public double Calculator_A()
    {
        double accrued = Calculator_Salary() * (1 + Premium / 100);
        return accrued * (pens_tax + tax);
    }

    public double Calculator_B()
    {
        double accrued = Calculator_Salary() * (1 + Premium / 100);
        return accrued - Calculator_A();
    }

    public int Years()
    {
        return DateTime.Now.Year - Ent_years;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Расчёт зарплаты ===");
        Console.Write("Введите имя: ");
        string name = Console.ReadLine();
        Console.Write("Введите фамилию: ");
        string surname = Console.ReadLine();
        Console.Write("Введите отчество: ");
        string patronymic = Console.ReadLine();
        string fio = $"{surname} {name} {patronymic}";
        double salary = 0;
        bool validSalary = false;
        while (!validSalary)
        {
            Console.Write("Введите оклад (в рублях, > 0): ");
            string input = Console.ReadLine();
            if (double.TryParse(input, out double value) && value > 0)
            {
                salary = value;
                validSalary = true;
            }
            else
            {
                Console.WriteLine("Ошибка: оклад должен быть положительным числом.");
            }
        }

        int yearHired = 0;
        bool validYear = false;
        int currentYear = DateTime.Now.Year;
        while (!validYear)
        {
            Console.Write($"Введите год поступления (от 1900 до {currentYear}): ");
            string input = Console.ReadLine();
            if (int.TryParse(input, out int value) && value >= 1900 && value <= currentYear)
            {
                yearHired = value;
                validYear = true;
            }
            else
            {
                Console.WriteLine("Ошибка: введите корректный год.");
            }
        }

   
        double premium = 0;
        bool validPremium = false;
        while (!validPremium)
        {
            Console.Write("Введите процент надбавки (например, 10 для 10%, можно 0): ");
            string input = Console.ReadLine();
            if (double.TryParse(input, out double value) && value >= 0)
            {
                premium = value;
                validPremium = true;
            }
            else
            {
                Console.WriteLine("Ошибка: процент не может быть отрицательным.");
            }
        }

  
        int totalWorkDays = 0;
        bool validTotalDays = false;
        while (!validTotalDays)
        {
            Console.Write("Введите количество рабочих дней в месяце (> 0): ");
            string input = Console.ReadLine();
            if (int.TryParse(input, out int value) && value > 0)
            {
                totalWorkDays = value;
                validTotalDays = true;
            }
            else
            {
                Console.WriteLine("Ошибка: количество дней должно быть целым положительным числом.");
            }
        }


        int workedDays = 0;
        bool validWorkedDays = false;
        while (!validWorkedDays)
        {
            Console.Write($"Введите количество отработанных дней (от 0 до {totalWorkDays}): ");
            string input = Console.ReadLine();
            if (int.TryParse(input, out int value) && value >= 0 && value <= totalWorkDays)
            {
                workedDays = value;
                validWorkedDays = true;
            }
            else
            {
                Console.WriteLine($"Ошибка: введите число от 0 до {totalWorkDays}.");
            }
        }

    
        var payment = new Payment(premium, name, surname, fio, salary, yearHired, workedDays, totalWorkDays);

        double basePay = payment.Calculator_Salary();
        double accrued = basePay * (1 + premium / 100);
        double deductions = payment.Calculator_A();
        double netPay = payment.Calculator_B();

        Console.WriteLine("\n Результаты расчёта ");
        Console.WriteLine($"ФИО: {payment.Pa_FIO}");
        Console.WriteLine($"Стаж: {payment.Years()} лет");
        Console.WriteLine($"Основная часть: {basePay:F2} руб.");
        Console.WriteLine($"Надбавка ({premium}%): {accrued - basePay:F2} руб.");
        Console.WriteLine($"Всего начислено: {accrued:F2} руб.");
        Console.WriteLine($"Удержано (14%): {deductions:F2} руб.");
        Console.WriteLine($"Выплачено на руки: {netPay:F2} руб.");
    }
}
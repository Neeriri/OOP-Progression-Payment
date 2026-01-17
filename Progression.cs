using System.Dynamic;

 public class ArProgresion
{
    public double first{get; set;}
    public double second{get; set;}
    
    public ArProgresion(double first, double second)
    {
        this.first=first;
        this.second=second;
    }
    public double Element(int i)
    {
        if (i < 0)
        {
            Console.WriteLine("Число должно быть положителным");
            return 0;
        }
        return first+second*i;
    }
}
class Program
{
    static void Main()
    { 
        int el_prog;
        double first_a0;
        double second_d;
        Console.WriteLine("Напишите элемент прогресии, Первое и второе число этой прогресии");
        Console.ReadLine(el_prog);
        Console.ReadLine(first_a0);
        Console.ReadLine(second_d);
        ArProgresion progresion1=new ArProgresion(first:first_a0, second:3.1);
        Console.WriteLine(progresion1.Element(el_prog));
        
    }
}
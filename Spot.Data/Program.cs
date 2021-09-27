using System;

namespace OmegaSpot.Data {
    /// <summary>test program to see NecoData in action</summary>
    public static class Program {

        static void Main() {

            using var Context = new SpotContext(); Console.WriteLine($"\n\nEverything:\n");

            foreach (System.Reflection.PropertyInfo Prop in Context.GetType().GetProperties()) {
                Console.WriteLine($"{Prop.Name}: {Prop.GetValue(Context)}");
            }
        }
    }


}

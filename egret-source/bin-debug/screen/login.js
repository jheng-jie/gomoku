var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var login = (function (_super) {
    __extends(login, _super);
    function login(options) {
        var _this = _super.call(this, options) || this;
        _this.fragment = "\n        precision lowp float;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        uniform sampler2D uSampler;\n        uniform vec2 center;\n        uniform vec3 params;\n        uniform float time;\n        void main()\n        {\n            vec2 uv = vTextureCoord.xy;\n            vec2 texCoord = uv;\n            float dist = distance(uv, center);\n            if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n            {\n                float diff = (dist - time);\n                float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n                float diffTime = diff  * powDiff;\n                vec2 diffUV = normalize(uv - center);\n                texCoord = uv + (diffUV * diffTime);\n            }\n            gl_FragColor = texture2D(uSampler, texCoord);\n        }\n    ";
        _this.vertex = "\n        attribute vec2 aVertexPosition;\n        attribute vec2 aTextureCoord;\n        attribute vec2 aColor;\n        uniform vec2 projectionVector;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        const vec2 center = vec2(-1.0, 1.0);\n        void main(void) {\n            gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n            vTextureCoord = aTextureCoord;\n            vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n        }\n    ";
        _this.nameList = { "boys": ["Noah", "Liam", "Mason", "Jacob", "William", "Ethan", "James", "Alexander", "Michael", "Benjamin", "Elijah", "Daniel", "Aiden", "Logan", "Matthew", "Lucas", "Jackson", "David", "Oliver", "Jayden", "Joseph", "Gabriel", "Samuel", "Carter", "Anthony", "John", "Dylan", "Luke", "Henry", "Andrew", "Isaac", "Christopher", "Joshua", "Wyatt", "Sebastian", "Owen", "Caleb", "Nathan", "Ryan", "Jack", "Hunter", "Levi", "Christian", "Jaxon", "Julian", "Landon", "Grayson", "Jonathan", "Isaiah", "Charles", "Thomas", "Aaron", "Eli", "Connor", "Jeremiah", "Cameron", "Josiah", "Adrian", "Colton", "Jordan", "Brayden", "Nicholas", "Robert", "Angel", "Hudson", "Lincoln", "Evan", "Dominic", "Austin", "Gavin", "Nolan", "Parker", "Adam", "Chase", "Jace", "Ian", "Cooper", "Easton", "Kevin", "Jose", "Tyler", "Brandon", "Asher", "Jaxson", "Mateo", "Jason", "Ayden", "Zachary", "Carson", "Xavier", "Leo", "Ezra", "Bentley", "Sawyer", "Kayden", "Blake", "Nathaniel", "Ryder", "Theodore", "Elias", "Tristan", "Roman", "Leonardo", "Camden", "Brody", "Luis", "Miles", "Micah", "Vincent", "Justin", "Greyson", "Declan", "Maxwell", "Juan", "Cole", "Damian", "Carlos", "Max", "Harrison", "Weston", "Brantley", "Braxton", "Axel", "Diego", "Abel", "Wesley", "Santiago", "Jesus", "Silas", "Giovanni", "Bryce", "Jayce", "Bryson", "Alex", "Everett", "George", "Eric", "Ivan", "Emmett", "Kaiden", "Ashton", "Kingston", "Jonah", "Jameson", "Kai", "Maddox", "Timothy", "Ezekiel", "Ryker", "Emmanuel", "Hayden", "Antonio", "Bennett", "Steven", "Richard", "Jude", "Luca", "Edward", "Joel", "Victor", "Miguel", "Malachi", "King", "Patrick", "Kaleb", "Bryan", "Alan", "Marcus", "Preston", "Abraham", "Calvin", "Colin", "Bradley", "Jeremy", "Kyle", "Graham", "Grant", "Jesse", "Kaden", "Alejandro", "Oscar", "Jase", "Karter", "Maverick", "Aidan", "Tucker", "Avery", "Amir", "Brian", "Iker", "Matteo", "Caden", "Zayden", "Riley", "August", "Mark", "Maximus", "Brady", "Kenneth", "Paul", "Jaden", "Nicolas", "Beau", "Dean", "Jake", "Peter", "Xander", "Elliot", "Finn", "Derek", "Sean", "Cayden", "Elliott", "Jax", "Jasper", "Lorenzo", "Omar", "Beckett", "Rowan", "Gael", "Corbin", "Waylon", "Myles", "Tanner", "Jorge", "Javier", "Zion", "Andres", "Charlie", "Paxton", "Emiliano", "Brooks", "Zane", "Simon", "Judah", "Griffin", "Cody", "Gunner", "Dawson", "Israel", "Rylan", "Gage", "Messiah", "River", "Kameron", "Stephen", "Francisco", "Clayton", "Zander", "Chance", "Eduardo", "Spencer", "Lukas", "Damien", "Dallas", "Conner", "Travis", "Knox", "Raymond", "Peyton", "Devin", "Felix", "Jayceon", "Collin", "Amari", "Erick", "Cash", "Jaiden", "Fernando", "Cristian", "Josue", "Keegan", "Garrett", "Rhett", "Ricardo", "Martin", "Reid", "Seth", "Andre", "Cesar", "Titus", "Donovan", "Manuel", "Mario", "Caiden", "Adriel", "Kyler", "Milo", "Archer", "Jeffrey", "Holden", "Arthur", "Karson", "Rafael", "Shane", "Lane", "Louis", "Angelo", "Remington", "Troy", "Emerson", "Maximiliano", "Hector", "Emilio", "Anderson", "Trevor", "Phoenix", "Walter", "Johnathan", "Johnny", "Edwin", "Julius", "Barrett", "Leon", "Tyson", "Tobias", "Edgar", "Dominick", "Marshall", "Marco", "Joaquin", "Dante", "Andy", "Cruz", "Ali", "Finley", "Dalton", "Gideon", "Reed", "Enzo", "Sergio", "Jett", "Thiago", "Kyrie", "Ronan", "Cohen", "Colt", "Erik", "Trenton", "Jared", "Walker", "Landen", "Alexis", "Nash", "Jaylen", "Gregory", "Emanuel", "Killian", "Allen", "Atticus", "Desmond", "Shawn", "Grady", "Quinn", "Frank", "Fabian", "Dakota", "Roberto", "Beckham", "Major", "Skyler", "Nehemiah", "Drew", "Cade", "Muhammad", "Kendrick", "Pedro", "Orion", "Aden", "Kamden", "Ruben", "Zaiden", "Clark", "Noel", "Porter", "Solomon", "Romeo", "Rory", "Malik", "Daxton", "Leland", "Kash", "Abram", "Derrick", "Kade", "Gunnar", "Prince", "Brendan", "Leonel", "Kason", "Braylon", "Legend", "Pablo", "Jay", "Adan", "Jensen", "Esteban", "Kellan", "Drake", "Warren", "Ismael", "Ari", "Russell", "Bruce", "Finnegan", "Marcos", "Jayson", "Theo", "Jaxton", "Phillip", "Dexter", "Braylen", "Armando", "Braden", "Corey", "Kolton", "Gerardo", "Ace", "Ellis", "Malcolm", "Tate", "Zachariah", "Chandler", "Milan", "Keith", "Danny", "Damon", "Enrique", "Jonas", "Kane", "Princeton", "Hugo", "Ronald", "Philip", "Ibrahim", "Kayson", "Maximilian", "Lawson", "Harvey", "Albert", "Donald", "Raul", "Franklin", "Hendrix", "Odin", "Brennan", "Jamison", "Dillon", "Brock", "Landyn", "Mohamed", "Brycen", "Deacon", "Colby", "Alec", "Julio", "Scott", "Matias", "Sullivan", "Rodrigo", "Cason", "Taylor", "Rocco", "Nico", "Royal", "Pierce", "Augustus", "Raiden", "Kasen", "Benson", "Moses", "Cyrus", "Raylan", "Davis", "Khalil", "Moises", "Conor", "Nikolai", "Alijah", "Mathew", "Keaton", "Francis", "Quentin", "Ty", "Jaime", "Ronin", "Kian", "Lennox", "Malakai", "Atlas", "Jerry", "Ryland", "Ahmed", "Saul", "Sterling", "Dennis", "Lawrence", "Zayne", "Bodhi", "Arjun", "Darius", "Arlo", "Eden", "Tony", "Dustin", "Kellen", "Chris", "Mohammed", "Nasir", "Omari", "Kieran", "Nixon", "Rhys", "Armani", "Arturo", "Bowen", "Frederick", "Callen", "Leonidas", "Remy", "Wade", "Luka", "Jakob", "Winston", "Justice", "Alonzo", "Curtis", "Aarav", "Gustavo", "Royce", "Asa", "Gannon", "Kyson", "Hank", "Izaiah", "Roy", "Raphael", "Luciano", "Hayes", "Case", "Darren", "Mohammad", "Otto", "Layton", "Isaias", "Alberto", "Jamari", "Colten", "Dax", "Marvin", "Casey", "Moshe", "Johan", "Sam", "Matthias", "Larry", "Trey", "Devon", "Trent", "Mauricio", "Mathias", "Issac", "Dorian", "Gianni", "Ahmad", "Nikolas", "Oakley", "Uriel", "Lewis", "Randy", "Cullen", "Braydon", "Ezequiel", "Reece", "Jimmy", "Crosby", "Soren", "Uriah", "Roger", "Nathanael", "Emmitt", "Gary", "Rayan", "Ricky", "Mitchell", "Roland", "Alfredo", "Cannon", "Jalen", "Tatum", "Kobe", "Yusuf", "Quinton", "Korbin", "Brayan", "Joe", "Byron", "Ariel", "Quincy", "Carl", "Kristopher", "Alvin", "Duke", "Lance", "London", "Jasiah", "Boston", "Santino", "Lennon", "Deandre", "Madden", "Talon", "Sylas", "Orlando", "Hamza", "Bo", "Aldo", "Douglas", "Tristen", "Wilson", "Maurice", "Samson", "Cayson", "Bryant", "Conrad", "Dane", "Julien", "Sincere", "Noe", "Salvador", "Nelson", "Edison", "Ramon", "Lucian", "Mekhi", "Niko", "Ayaan", "Vihaan", "Neil", "Titan", "Ernesto", "Brentley", "Lionel", "Zayn", "Dominik", "Cassius", "Rowen", "Blaine", "Sage", "Kelvin", "Jaxen", "Memphis", "Leonard", "Abdullah", "Jacoby", "Allan", "Jagger", "Yahir", "Forrest", "Guillermo", "Mack", "Zechariah", "Harley", "Terry", "Kylan", "Fletcher", "Rohan", "Eddie", "Bronson", "Jefferson", "Rayden", "Terrance", "Marc", "Morgan", "Valentino", "Demetrius", "Kristian", "Hezekiah", "Lee", "Alessandro", "Makai", "Rex", "Callum", "Kamari", "Casen", "Tripp", "Callan", "Stanley", "Toby", "Elian", "Langston", "Melvin", "Payton", "Flynn", "Jamir", "Kyree", "Aryan", "Axton", "Azariah", "Branson", "Reese", "Adonis", "Thaddeus", "Zeke", "Tommy", "Blaze", "Carmelo", "Skylar", "Arian", "Bruno", "Kaysen", "Layne", "Ray", "Zain", "Crew", "Jedidiah", "Rodney", "Clay", "Tomas", "Alden", "Jadiel", "Harper", "Ares", "Cory", "Brecken", "Chaim", "Nickolas", "Kareem", "Xzavier", "Kaison", "Alonso", "Amos", "Vicente", "Samir", "Yosef", "Jamal", "Jon", "Bobby", "Aron", "Ben", "Ford", "Brodie", "Cain", "Finnley", "Briggs", "Davion", "Kingsley", "Brett", "Wayne", "Zackary", "Apollo", "Emery", "Joziah", "Lucca", "Bentlee", "Hassan", "Westin", "Joey", "Vance", "Marcelo", "Axl", "Jermaine", "Chad", "Gerald", "Kole", "Dash", "Dayton", "Lachlan", "Shaun", "Kody", "Ronnie", "Kolten", "Marcel", "Stetson", "Willie", "Jeffery", "Brantlee", "Elisha", "Maxim", "Kendall", "Harry", "Leandro", "Aaden", "Channing", "Kohen", "Yousef", "Darian", "Enoch", "Mayson", "Neymar", "Giovani", "Alfonso", "Duncan", "Anders", "Braeden", "Dwayne", "Keagan", "Felipe", "Fisher", "Stefan", "Trace", "Aydin", "Anson", "Clyde", "Blaise", "Canaan", "Maxton", "Alexzander", "Billy", "Harold", "Baylor", "Gordon", "Rene", "Terrence", "Vincenzo", "Kamdyn", "Marlon", "Castiel", "Lamar", "Augustine", "Jamie", "Eugene", "Harlan", "Kase", "Miller", "Van", "Kolby", "Sonny", "Emory", "Junior", "Graysen", "Heath", "Rogelio", "Will", "Amare", "Ameer", "Camdyn", "Jerome", "Maison", "Micheal", "Cristiano", "Giancarlo", "Henrik", "Lochlan", "Bode", "Camron", "Houston", "Otis", "Hugh", "Kannon", "Konnor", "Emmet", "Kamryn", "Maximo", "Adrien", "Cedric", "Dariel", "Landry", "Leighton", "Magnus", "Draven", "Javon", "Marley", "Zavier", "Markus", "Justus", "Reyansh", "Rudy", "Santana", "Misael", "Abdiel", "Davian", "Zaire", "Jordy", "Reginald", "Benton", "Darwin", "Franco", "Jairo", "Jonathon", "Reuben", "Urijah", "Vivaan", "Brent", "Gauge", "Vaughn", "Coleman", "Zaid", "Terrell", "Kenny", "Brice", "Lyric", "Judson", "Shiloh", "Damari", "Kalel", "Braiden", "Brenden", "Coen", "Denver", "Javion", "Thatcher", "Rey", "Dilan", "Dimitri", "Immanuel", "Mustafa", "Ulises", "Alvaro", "Dominique", "Eliseo", "Anakin", "Craig", "Dario", "Santos", "Grey", "Ishaan", "Jessie", "Jonael", "Alfred", "Tyrone", "Valentin", "Jadon", "Turner", "Ignacio", "Riaan", "Rocky", "Ephraim", "Marquis", "Musa", "Keenan", "Ridge", "Chace", "Kymani", "Rodolfo", "Darrell", "Steve", "Agustin", "Jaziel", "Boone", "Cairo", "Kashton", "Rashad", "Gibson", "Jabari", "Avi", "Quintin", "Seamus", "Rolando", "Sutton", "Camilo", "Triston", "Yehuda", "Cristopher", "Davin", "Ernest", "Jamarion", "Kamren", "Salvatore", "Anton", "Aydan", "Huxley", "Jovani", "Wilder", "Bodie", "Jordyn", "Louie", "Achilles", "Kaeden", "Kamron", "Aarush", "Deangelo", "Robin", "Yadiel", "Yahya", "Boden", "Ean", "Kye", "Kylen", "Todd", "Truman", "Chevy", "Gilbert", "Haiden", "Brixton", "Dangelo", "Juelz", "Osvaldo", "Bishop", "Freddy", "Reagan", "Frankie", "Malaki", "Camren", "Deshawn", "Jayvion", "Leroy", "Briar", "Jaydon", "Antoine"], "girls": ["Emma", "Olivia", "Sophia", "Ava", "Isabella", "Mia", "Abigail", "Emily", "Charlotte", "Harper", "Madison", "Amelia", "Elizabeth", "Sofia", "Evelyn", "Avery", "Chloe", "Ella", "Grace", "Victoria", "Aubrey", "Scarlett", "Zoey", "Addison", "Lily", "Lillian", "Natalie", "Hannah", "Aria", "Layla", "Brooklyn", "Alexa", "Zoe", "Penelope", "Riley", "Leah", "Audrey", "Savannah", "Allison", "Samantha", "Nora", "Skylar", "Camila", "Anna", "Paisley", "Ariana", "Ellie", "Aaliyah", "Claire", "Violet", "Stella", "Sadie", "Mila", "Gabriella", "Lucy", "Arianna", "Kennedy", "Sarah", "Madelyn", "Eleanor", "Kaylee", "Caroline", "Hazel", "Hailey", "Genesis", "Kylie", "Autumn", "Piper", "Maya", "Nevaeh", "Serenity", "Peyton", "Mackenzie", "Bella", "Eva", "Taylor", "Naomi", "Aubree", "Aurora", "Melanie", "Lydia", "Brianna", "Ruby", "Katherine", "Ashley", "Alexis", "Alice", "Cora", "Julia", "Madeline", "Faith", "Annabelle", "Alyssa", "Isabelle", "Vivian", "Gianna", "Quinn", "Clara", "Reagan", "Khloe", "Alexandra", "Hadley", "Eliana", "Sophie", "London", "Elena", "Kimberly", "Bailey", "Maria", "Luna", "Willow", "Jasmine", "Kinsley", "Valentina", "Kayla", "Delilah", "Andrea", "Natalia", "Lauren", "Morgan", "Rylee", "Sydney", "Adalynn", "Mary", "Ximena", "Jade", "Liliana", "Brielle", "Ivy", "Trinity", "Josephine", "Adalyn", "Jocelyn", "Emery", "Adeline", "Jordyn", "Ariel", "Everly", "Lilly", "Paige", "Isla", "Lyla", "Makayla", "Molly", "Emilia", "Mya", "Kendall", "Melody", "Isabel", "Brooke", "Mckenzie", "Nicole", "Payton", "Margaret", "Mariah", "Eden", "Athena", "Amy", "Norah", "Londyn", "Valeria", "Sara", "Aliyah", "Angelina", "Gracie", "Rose", "Rachel", "Juliana", "Laila", "Brooklynn", "Valerie", "Alina", "Reese", "Elise", "Eliza", "Alaina", "Raelynn", "Leilani", "Catherine", "Emerson", "Cecilia", "Genevieve", "Daisy", "Harmony", "Vanessa", "Adriana", "Presley", "Rebecca", "Destiny", "Hayden", "Julianna", "Michelle", "Adelyn", "Arabella", "Summer", "Callie", "Kaitlyn", "Ryleigh", "Lila", "Daniela", "Arya", "Alana", "Esther", "Finley", "Gabrielle", "Jessica", "Charlie", "Stephanie", "Tessa", "Makenzie", "Ana", "Amaya", "Alexandria", "Alivia", "Nova", "Anastasia", "Iris", "Marley", "Fiona", "Angela", "Giselle", "Kate", "Alayna", "Lola", "Lucia", "Juliette", "Parker", "Teagan", "Sienna", "Georgia", "Hope", "Cali", "Vivienne", "Izabella", "Kinley", "Daleyza", "Kylee", "Jayla", "Katelyn", "Juliet", "Maggie", "Dakota", "Delaney", "Brynlee", "Keira", "Camille", "Leila", "Mckenna", "Aniyah", "Noelle", "Josie", "Jennifer", "Melissa", "Gabriela", "Allie", "Eloise", "Cassidy", "Jacqueline", "Brynn", "Sawyer", "Evangeline", "Jordan", "Paris", "Olive", "Ayla", "Rosalie", "Kali", "Maci", "Gemma", "Lilliana", "Raegan", "Lena", "Adelaide", "Journey", "Adelynn", "Alessandra", "Kenzie", "Miranda", "Haley", "June", "Harley", "Charlee", "Lucille", "Talia", "Skyler", "Makenna", "Phoebe", "Jane", "Lyric", "Angel", "Elaina", "Adrianna", "Ruth", "Miriam", "Diana", "Mariana", "Danielle", "Jenna", "Shelby", "Nina", "Madeleine", "Elliana", "Amina", "Amiyah", "Chelsea", "Joanna", "Jada", "Lexi", "Katie", "Maddison", "Fatima", "Vera", "Malia", "Lilah", "Madilyn", "Amanda", "Daniella", "Alexia", "Kathryn", "Paislee", "Selena", "Laura", "Annie", "Nyla", "Catalina", "Kayleigh", "Sloane", "Kamila", "Lia", "Haven", "Rowan", "Ashlyn", "Christina", "Amber", "Myla", "Addilyn", "Erin", "Alison", "Ainsley", "Raelyn", "Cadence", "Kendra", "Heidi", "Kelsey", "Nadia", "Alondra", "Cheyenne", "Kaydence", "Mikayla", "River", "Heaven", "Arielle", "Lana", "Blakely", "Sabrina", "Kyla", "Ada", "Gracelyn", "Allyson", "Felicity", "Kira", "Briella", "Kamryn", "Adaline", "Alicia", "Ember", "Aylin", "Veronica", "Esmeralda", "Sage", "Leslie", "Aspen", "Gia", "Camilla", "Ashlynn", "Scarlet", "Journee", "Daphne", "Bianca", "Mckinley", "Amira", "Carmen", "Kyleigh", "Megan", "Skye", "Elsie", "Kennedi", "Averie", "Carly", "Rylie", "Gracelynn", "Mallory", "Emersyn", "Logan", "Camryn", "Annabella", "Dylan", "Elle", "Kiara", "Yaretzi", "Ariella", "Zara", "April", "Gwendolyn", "Anaya", "Baylee", "Brinley", "Sierra", "Annalise", "Tatum", "Serena", "Dahlia", "Macy", "Miracle", "Madelynn", "Briana", "Freya", "Macie", "Helen", "Bethany", "Leia", "Harlow", "Blake", "Jayleen", "Angelica", "Marilyn", "Viviana", "Francesca", "Juniper", "Carolina", "Jazmin", "Emely", "Maliyah", "Cataleya", "Jillian", "Joy", "Abby", "Malaysia", "Nylah", "Sarai", "Evelynn", "Nia", "Zuri", "Addyson", "Aleah", "Kaia", "Bristol", "Lorelei", "Jazmine", "Maeve", "Alejandra", "Justice", "Julie", "Marlee", "Phoenix", "Jimena", "Emmalyn", "Nayeli", "Aleena", "Brittany", "Amara", "Karina", "Giuliana", "Thea", "Braelynn", "Kassidy", "Braelyn", "Luciana", "Aubrie", "Janelle", "Madisyn", "Brylee", "Leighton", "Ryan", "Amari", "Eve", "Millie", "Kelly", "Selah", "Lacey", "Willa", "Haylee", "Jaylah", "Sylvia", "Melany", "Elisa", "Elsa", "Hattie", "Raven", "Holly", "Aisha", "Itzel", "Kyra", "Tiffany", "Jayda", "Michaela", "Madilynn", "Jamie", "Celeste", "Lilian", "Remi", "Priscilla", "Jazlyn", "Karen", "Savanna", "Zariah", "Lauryn", "Alanna", "Kara", "Karla", "Cassandra", "Ariah", "Evie", "Frances", "Aileen", "Lennon", "Charley", "Rosemary", "Danna", "Regina", "Kaelyn", "Virginia", "Hanna", "Rebekah", "Alani", "Edith", "Liana", "Charleigh", "Gloria", "Cameron", "Colette", "Kailey", "Carter", "Helena", "Matilda", "Imani", "Bridget", "Cynthia", "Janiyah", "Marissa", "Johanna", "Sasha", "Kaliyah", "Cecelia", "Adelina", "Jessa", "Hayley", "Julissa", "Winter", "Crystal", "Kaylie", "Bailee", "Charli", "Henley", "Anya", "Maia", "Skyla", "Liberty", "Fernanda", "Monica", "Braylee", "Dallas", "Mariam", "Marie", "Beatrice", "Hallie", "Maryam", "Angelique", "Anne", "Madalyn", "Alayah", "Annika", "Greta", "Lilyana", "Kadence", "Coraline", "Lainey", "Mabel", "Lillie", "Anika", "Azalea", "Dayana", "Jaliyah", "Addisyn", "Emilee", "Mira", "Angie", "Lilith", "Mae", "Meredith", "Guadalupe", "Emelia", "Margot", "Melina", "Aniya", "Alena", "Myra", "Elianna", "Caitlyn", "Jaelynn", "Jaelyn", "Demi", "Mikaela", "Tiana", "Blair", "Shiloh", "Ariyah", "Saylor", "Caitlin", "Lindsey", "Oakley", "Alia", "Everleigh", "Ivanna", "Miah", "Emmy", "Jessie", "Anahi", "Kaylin", "Ansley", "Annabel", "Remington", "Kora", "Maisie", "Nathalie", "Emory", "Karsyn", "Pearl", "Irene", "Kimber", "Rosa", "Lylah", "Magnolia", "Samara", "Elliot", "Renata", "Galilea", "Kensley", "Kiera", "Whitney", "Amelie", "Siena", "Bria", "Laney", "Perla", "Tatiana", "Zelda", "Jaycee", "Kori", "Montserrat", "Lorelai", "Adele", "Elyse", "Katelynn", "Kynlee", "Marina", "Jayden", "Kailyn", "Avah", "Kenley", "Aviana", "Armani", "Dulce", "Alaia", "Teresa", "Natasha", "Milani", "Amirah", "Breanna", "Linda", "Tenley", "Sutton", "Elaine", "Elliott", "Aliza", "Kenna", "Meadow", "Alyson", "Rory", "Milana", "Erica", "Esme", "Leona", "Joselyn", "Madalynn", "Alma", "Chanel", "Myah", "Karter", "Zahra", "Audrina", "Ariya", "Jemma", "Eileen", "Kallie", "Milan", "Emmalynn", "Lailah", "Sloan", "Clarissa", "Karlee", "Laylah", "Amiya", "Collins", "Ellen", "Hadassah", "Danica", "Jaylene", "Averi", "Reyna", "Saige", "Wren", "Lexie", "Dorothy", "Lilianna", "Monroe", "Aryanna", "Elisabeth", "Ivory", "Liv", "Janessa", "Jaylynn", "Livia", "Rayna", "Alaya", "Malaya", "Cara", "Erika", "Amani", "Clare", "Addilynn", "Roselyn", "Corinne", "Paola", "Jolene", "Anabelle", "Aliana", "Lea", "Mara", "Lennox", "Claudia", "Kristina", "Jaylee", "Kaylynn", "Zariyah", "Gwen", "Kinslee", "Avianna", "Lisa", "Raquel", "Jolie", "Carolyn", "Courtney", "Penny", "Royal", "Alannah", "Ciara", "Chaya", "Kassandra", "Milena", "Mina", "Noa", "Leanna", "Zoie", "Ariadne", "Monserrat", "Nola", "Carlee", "Isabela", "Jazlynn", "Kairi", "Laurel", "Sky", "Rosie", "Arely", "Aubrielle", "Kenia", "Noemi", "Scarlette", "Farrah", "Leyla", "Amia", "Bryanna", "Naya", "Wynter", "Hunter", "Katalina", "Taliyah", "Amaris", "Emerie", "Martha", "Thalia", "Christine", "Estrella", "Brenna", "Milania", "Salma", "Lillianna", "Marjorie", "Shayla", "Zendaya", "Aurelia", "Brenda", "Julieta", "Adilynn", "Deborah", "Keyla", "Patricia", "Emmeline", "Hadlee", "Giovanna", "Kailee", "Desiree", "Casey", "Karlie", "Khaleesi", "Lara", "Tori", "Clementine", "Nancy", "Simone", "Ayleen", "Estelle", "Celine", "Madyson", "Zaniyah", "Adley", "Amalia", "Paityn", "Kathleen", "Sandra", "Lizbeth", "Maleah", "Micah", "Aryana", "Hailee", "Aiyana", "Joyce", "Ryann", "Caylee", "Kalani", "Marisol", "Nathaly", "Briar", "Holland", "Lindsay", "Remy", "Adrienne", "Azariah", "Harlee", "Dana", "Frida", "Marianna", "Yamileth", "Chana", "Kaya", "Lina", "Celia", "Analia", "Hana", "Jayde", "Joslyn", "Romina", "Anabella", "Barbara", "Bryleigh", "Emilie", "Nathalia", "Ally", "Evalyn", "Bonnie", "Zaria", "Carla", "Estella", "Kailani", "Rivka", "Rylan", "Paulina", "Kayden", "Giana", "Yareli", "Kaiya", "Sariah", "Avalynn", "Jasmin", "Aya", "Jewel", "Kristen", "Paula", "Astrid", "Jordynn", "Kenya", "Ann", "Annalee", "Kai", "Kiley", "Marleigh", "Julianne", "Zion", "Emmaline", "Nataly", "Aminah", "Amya", "Iliana", "Jaida", "Paloma", "Asia", "Louisa", "Sarahi", "Tara", "Andi", "Arden", "Dalary", "Aimee", "Alisson", "Halle", "Aitana", "Landry", "Alisha", "Elin", "Maliah", "Belen", "Briley", "Raina", "Vienna", "Esperanza", "Judith", "Faye", "Susan", "Aliya", "Aranza", "Yasmin", "Jaylin", "Kyndall", "Saniyah", "Wendy", "Yaritza", "Azaria", "Kaelynn", "Neriah", "Zainab", "Alissa", "Cherish", "Dixie", "Veda", "Nala", "Tabitha", "Cordelia", "Ellison", "Meilani", "Angeline", "Reina", "Tegan", "Hadleigh", "Harmoni", "Kimora", "Ingrid", "Lilia", "Luz", "Aislinn", "America", "Ellis", "Elora", "Heather", "Natalee", "Miya", "Heavenly", "Jenny", "Aubriella", "Emmalee", "Kensington", "Kiana", "Lilyanna", "Tinley", "Ophelia", "Moriah", "Sharon", "Charlize", "Abril", "Avalyn", "Mariyah", "Taya", "Ireland", "Lyra", "Noor", "Sariyah", "Giavanna", "Stevie", "Rhea", "Zaylee", "Denise", "Frankie", "Janiya", "Jocelynn", "Libby", "Aubrianna", "Kaitlynn", "Princess", "Sidney", "Alianna"], "last": ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen", "Sanchez", "Wright", "King", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Flores", "Morris", "Nguyen", "Murphy", "Rivera", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox", "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James", "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders", "Ross", "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez", "Perry", "Butler", "Barnes", "Fisher", "Henderson", "Coleman", "Simmons", "Patterson", "Jordan", "Reynolds", "Hamilton", "Graham", "Kim", "Gonzales", "Alexander", "Ramos", "Wallace", "Griffin", "West", "Cole", "Hayes", "Chavez", "Gibson", "Bryant", "Ellis", "Stevens", "Murray", "Ford", "Marshall", "Owens", "Mcdonald", "Harrison", "Ruiz", "Kennedy", "Wells", "Alvarez", "Woods", "Mendoza", "Castillo", "Olson", "Webb", "Washington", "Tucker", "Freeman", "Burns", "Henry", "Vasquez", "Snyder", "Simpson", "Crawford", "Jimenez", "Porter", "Mason", "Shaw", "Gordon", "Wagner", "Hunter", "Romero", "Hicks", "Dixon", "Hunt", "Palmer", "Robertson", "Black", "Holmes", "Stone", "Meyer", "Boyd", "Mills", "Warren", "Fox", "Rose", "Rice", "Moreno", "Schmidt", "Patel", "Ferguson", "Nichols", "Herrera", "Medina", "Ryan", "Fernandez", "Weaver", "Daniels", "Stephens", "Gardner", "Payne", "Kelley", "Dunn", "Pierce", "Arnold", "Tran", "Spencer", "Peters", "Hawkins", "Grant", "Hansen", "Castro", "Hoffman", "Hart", "Elliott", "Cunningham", "Knight", "Bradley", "Carroll", "Hudson", "Duncan", "Armstrong", "Berry", "Andrews", "Johnston", "Ray", "Lane", "Riley", "Carpenter", "Perkins", "Aguilar", "Silva", "Richards", "Willis", "Matthews", "Chapman", "Lawrence", "Garza", "Vargas", "Watkins", "Wheeler", "Larson", "Carlson", "Harper", "George", "Greene", "Burke", "Guzman", "Morrison", "Munoz", "Jacobs", "Obrien", "Lawson", "Franklin", "Lynch", "Bishop", "Carr", "Salazar", "Austin", "Mendez", "Gilbert", "Jensen", "Williamson", "Montgomery", "Harvey", "Oliver", "Howell", "Dean", "Hanson", "Weber", "Garrett", "Sims", "Burton", "Fuller", "Soto", "Mccoy", "Welch", "Chen", "Schultz", "Walters", "Reid", "Fields", "Walsh", "Little", "Fowler", "Bowman", "Davidson", "May", "Day", "Schneider", "Newman", "Brewer", "Lucas", "Holland", "Wong", "Banks", "Santos", "Curtis", "Pearson", "Delgado", "Valdez", "Pena", "Rios", "Douglas", "Sandoval", "Barrett", "Hopkins", "Keller", "Guerrero", "Stanley", "Bates", "Alvarado", "Beck", "Ortega", "Wade", "Estrada", "Contreras", "Barnett", "Caldwell", "Santiago", "Lambert", "Powers", "Chambers", "Nunez", "Craig", "Leonard", "Lowe", "Rhodes", "Byrd", "Gregory", "Shelton", "Frazier", "Becker", "Maldonado", "Fleming", "Vega", "Sutton", "Cohen", "Jennings", "Parks", "Mcdaniel", "Watts", "Barker", "Norris", "Vaughn", "Vazquez", "Holt", "Schwartz", "Steele", "Benson", "Neal", "Dominguez", "Horton", "Terry", "Wolfe", "Hale", "Lyons", "Graves", "Haynes", "Miles", "Park", "Warner", "Padilla", "Bush", "Thornton", "Mccarthy", "Mann", "Zimmerman", "Erickson", "Fletcher", "Mckinney", "Page", "Dawson", "Joseph", "Marquez", "Reeves", "Klein", "Espinoza", "Baldwin", "Moran", "Love", "Robbins", "Higgins", "Ball", "Cortez", "Le", "Griffith", "Bowen", "Sharp", "Cummings", "Ramsey", "Hardy", "Swanson", "Barber", "Acosta", "Luna", "Chandler", "Daniel", "Blair", "Cross", "Simon", "Dennis", "Oconnor", "Quinn", "Gross", "Navarro", "Moss", "Fitzgerald", "Doyle", "Mclaughlin", "Rojas", "Rodgers", "Stevenson", "Singh", "Yang", "Figueroa", "Harmon", "Newton", "Paul", "Manning", "Garner", "Mcgee", "Reese", "Francis", "Burgess", "Adkins", "Goodman", "Curry", "Brady", "Christensen", "Potter", "Walton", "Goodwin", "Mullins", "Molina", "Webster", "Fischer", "Campos", "Avila", "Sherman", "Todd", "Chang", "Blake", "Malone", "Wolf", "Hodges", "Juarez", "Gill", "Farmer", "Hines", "Gallagher", "Duran", "Hubbard", "Cannon", "Miranda", "Wang", "Saunders", "Tate", "Mack", "Hammond", "Carrillo", "Townsend", "Wise", "Ingram", "Barton", "Mejia", "Ayala", "Schroeder", "Hampton", "Rowe", "Parsons", "Frank", "Waters", "Strickland", "Osborne", "Maxwell", "Chan", "Deleon", "Norman", "Harrington", "Casey", "Patton", "Logan", "Bowers", "Mueller", "Glover", "Floyd", "Hartman", "Buchanan", "Cobb", "French", "Kramer", "Mccormick", "Clarke", "Tyler", "Gibbs", "Moody", "Conner", "Sparks", "Mcguire", "Leon", "Bauer", "Norton", "Pope", "Flynn", "Hogan", "Robles", "Salinas", "Yates", "Lindsey", "Lloyd", "Marsh", "Mcbride", "Owen", "Solis", "Pham", "Lang", "Pratt", "Lara", "Brock", "Ballard", "Trujillo", "Shaffer", "Drake", "Roman", "Aguirre", "Morton", "Stokes", "Lamb", "Pacheco", "Patrick", "Cochran", "Shepherd", "Cain", "Burnett", "Hess", "Li", "Cervantes", "Olsen", "Briggs", "Ochoa", "Cabrera", "Velasquez", "Montoya", "Roth", "Meyers", "Cardenas", "Fuentes", "Weiss", "Wilkins", "Hoover", "Nicholson", "Underwood", "Short", "Carson", "Morrow", "Colon", "Holloway", "Summers", "Bryan", "Petersen", "Mckenzie", "Serrano", "Wilcox", "Carey", "Clayton", "Poole", "Calderon", "Gallegos", "Greer", "Rivas", "Guerra", "Decker", "Collier", "Wall", "Whitaker", "Bass", "Flowers", "Davenport", "Conley", "Houston", "Huff", "Copeland", "Hood", "Monroe", "Massey", "Roberson", "Combs", "Franco", "Larsen", "Pittman", "Randall", "Skinner", "Wilkinson", "Kirby", "Cameron", "Bridges", "Anthony", "Richard", "Kirk", "Bruce", "Singleton", "Mathis", "Bradford", "Boone", "Abbott", "Charles", "Allison", "Sweeney", "Atkinson", "Horn", "Jefferson", "Rosales", "York", "Christian", "Phelps", "Farrell", "Castaneda", "Nash", "Dickerson", "Bond", "Wyatt", "Foley", "Chase", "Gates", "Vincent", "Mathews", "Hodge", "Garrison", "Trevino", "Villarreal", "Heath", "Dalton", "Valencia", "Callahan", "Hensley", "Atkins", "Huffman", "Roy", "Boyer", "Shields", "Lin", "Hancock", "Grimes", "Glenn", "Cline", "Delacruz", "Camacho", "Dillon", "Parrish", "Oneill", "Melton", "Booth", "Kane", "Berg", "Harrell", "Pitts", "Savage", "Wiggins", "Brennan", "Salas", "Marks", "Russo", "Sawyer", "Baxter", "Golden", "Hutchinson", "Liu", "Walter", "Mcdowell", "Wiley", "Rich", "Humphrey", "Johns", "Koch", "Suarez", "Hobbs", "Beard", "Gilmore", "Ibarra", "Keith", "Macias", "Khan", "Andrade", "Ware", "Stephenson", "Henson", "Wilkerson", "Dyer", "Mcclure", "Blackwell", "Mercado", "Tanner", "Eaton", "Clay", "Barron", "Beasley", "Oneal", "Small", "Preston", "Wu", "Zamora", "Macdonald", "Vance", "Snow", "Mcclain", "Stafford", "Orozco", "Barry", "English", "Shannon", "Kline", "Jacobson", "Woodard", "Huang", "Kemp", "Mosley", "Prince", "Merritt", "Hurst", "Villanueva", "Roach", "Nolan", "Lam", "Yoder", "Mccullough", "Lester", "Santana", "Valenzuela", "Winters", "Barrera", "Orr", "Leach", "Berger", "Mckee", "Strong", "Conway", "Stein", "Whitehead", "Bullock", "Escobar", "Knox", "Meadows", "Solomon", "Velez", "Odonnell", "Kerr", "Stout", "Blankenship", "Browning", "Kent", "Lozano", "Bartlett", "Pruitt", "Buck", "Barr", "Gaines", "Durham", "Gentry", "Mcintyre", "Sloan", "Rocha", "Melendez", "Herman", "Sexton", "Moon", "Hendricks", "Rangel", "Stark", "Lowery", "Hardin", "Hull", "Sellers", "Ellison", "Calhoun", "Gillespie", "Mora", "Knapp", "Mccall", "Morse", "Dorsey", "Weeks", "Nielsen", "Livingston", "Leblanc", "Mclean", "Bradshaw", "Glass", "Middleton", "Buckley", "Schaefer", "Frost", "Howe", "House", "Mcintosh", "Ho", "Pennington", "Reilly", "Hebert", "Mcfarland", "Hickman", "Noble", "Spears", "Conrad", "Arias", "Galvan", "Velazquez", "Huynh", "Frederick", "Randolph", "Cantu", "Fitzpatrick", "Mahoney", "Peck", "Villa", "Michael", "Donovan", "Mcconnell", "Walls", "Boyle", "Mayer", "Zuniga", "Giles", "Pineda", "Pace", "Hurley", "Mays", "Mcmillan", "Crosby", "Ayers", "Case", "Bentley", "Shepard", "Everett", "Pugh", "David", "Mcmahon", "Dunlap", "Bender", "Hahn", "Harding", "Acevedo", "Raymond", "Blackburn", "Duffy", "Landry", "Dougherty", "Bautista", "Shah", "Potts", "Arroyo", "Valentine", "Meza", "Gould", "Vaughan", "Fry", "Rush", "Avery", "Herring", "Dodson", "Clements", "Sampson", "Tapia", "Bean", "Lynn", "Crane", "Farley", "Cisneros", "Benton", "Ashley", "Mckay", "Finley", "Best", "Blevins", "Friedman", "Moses", "Sosa", "Blanchard", "Huber", "Frye", "Krueger", "Bernard", "Rosario", "Rubio", "Mullen", "Benjamin", "Haley", "Chung", "Moyer", "Choi", "Horne", "Yu", "Woodward", "Ali", "Nixon", "Hayden", "Rivers", "Estes", "Mccarty", "Richmond", "Stuart", "Maynard", "Brandt", "Oconnell", "Hanna", "Sanford", "Sheppard", "Church", "Burch", "Levy", "Rasmussen", "Coffey", "Ponce", "Faulkner", "Donaldson", "Schmitt", "Novak", "Costa", "Montes", "Booker", "Cordova", "Waller", "Arellano", "Maddox", "Mata", "Bonilla", "Stanton", "Compton", "Kaufman", "Dudley", "Mcpherson", "Beltran", "Dickson", "Mccann", "Villegas", "Proctor", "Hester", "Cantrell", "Daugherty", "Cherry", "Bray", "Davila", "Rowland", "Madden", "Levine", "Spence", "Good", "Irwin", "Werner", "Krause", "Petty", "Whitney", "Baird", "Hooper", "Pollard", "Zavala", "Jarvis", "Holden", "Hendrix", "Haas", "Mcgrath", "Bird", "Lucero", "Terrell", "Riggs", "Joyce", "Rollins", "Mercer", "Galloway", "Duke", "Odom", "Andersen", "Downs", "Hatfield", "Benitez", "Archer", "Huerta", "Travis", "Mcneil", "Hinton", "Zhang", "Hays", "Mayo", "Fritz", "Branch", "Mooney", "Ewing", "Ritter", "Esparza", "Frey", "Braun", "Gay", "Riddle", "Haney", "Kaiser", "Holder", "Chaney", "Mcknight", "Gamble", "Vang", "Cooley", "Carney", "Cowan", "Forbes", "Ferrell", "Davies", "Barajas", "Shea", "Osborn", "Bright", "Cuevas", "Bolton", "Murillo", "Lutz", "Duarte", "Kidd", "Key", "Cookie"] };
        /* icon event */
        _this.faceEvent = {
            hold: false,
            startX: 0,
            originX: 0,
            animate: undefined,
            index: 0
        };
        _this.once(egret.Event.ADDED_TO_STAGE, _this.createUI, _this);
        options.stage.addChild(_this);
        return _this;
    }
    login.prototype.onListener = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onFace, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onFace, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onFace, this);
        this.login.addEventListener(egret.TouchEvent.TOUCH_END, this.onLogin, this);
        this.nameInput.type = egret.TextFieldType.INPUT;
        this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.onInput, this);
        this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onInput, this);
    };
    login.prototype.offListener = function () {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onFace, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onFace, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onFace, this);
        this.login.removeEventListener(egret.TouchEvent.TOUCH_END, this.onLogin, this);
        this.nameInput.type = egret.TextFieldInputType.TEXT;
        this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.onInput, this);
        this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onInput, this);
    };
    /* 建立 UI */
    login.prototype.createUI = function () {
        /* title */
        var title = ui.TextField({
            text: "Gomoku",
            size: 100,
            parent: this,
            width: this.stageW,
            height: this.stageH * .25,
            textColor: 0x51362a
        });
        /* face mask */
        var faceMask = ui.Shape({
            rx: 0, ry: this.stageH * .425 - 140, rw: this.stageW, rh: 280,
            parent: this
        });
        /* face group */
        this.face = ui.Group({
            y: this.stageH * .425,
            parent: this,
            mask: faceMask
        });
        /* face index */
        Object.defineProperty(this, 'faceIndex', {
            get: function () {
                return this.faceEvent.index;
            },
            set: function (i) {
                if (this.faceEvent.index != i) {
                    if (i == 0 || i == 2)
                        this.nameInput.text = this.nameList.boys[Math.floor(Math.random() * (this.nameList.boys.length - 1))];
                    else
                        this.nameInput.text = this.nameList.girls[Math.floor(Math.random() * (this.nameList.girls.length - 1))];
                }
                this.faceEvent.index = i;
                this.faceEvent.animate = TweenMax.to(this.face, 1, {
                    x: i * -this.stageW,
                    ease: Back.easeOut.config(1),
                });
            }
        });
        this.faceEvent.index = Math.floor(Math.random() * 5);
        this.face.x = this.faceEvent.index * -this.stageW;
        /* 水波特效 */
        this.filter = new egret.CustomFilter(this.vertex, this.fragment, {
            center: { x: 0.5, y: 0.5 },
            params: { x: 10, y: 1, z: 0.1 },
            time: 0
        });
        this.filterAnimate = TweenMax.fromTo(this.filter.uniforms, 2, { time: 0 }, { time: 2.5, delay: 0.5, paused: true });
        /* face child */
        for (var i = 0; i < 6; i++) {
            var icon = ui.Bitmap({
                texture: RES.getRes(i + "_png"),
                width: 250,
                height: 250,
                x: this.stageW * .5 + i * this.stageW,
                parent: this.face
            });
            icon.filters = [this.filter];
        }
        /* name label */
        var nameLabel = ui.TextField({
            textAlign: egret.HorizontalAlign.RIGHT,
            text: "Name : ",
            size: 28,
            parent: this,
            width: this.stageW * .3,
            height: 50,
            y: this.stageH * .71 - 25,
            textColor: 0x51362a
        });
        /* name input */
        this.nameInput = ui.TextField({
            text: this.nameList.boys[Math.floor(Math.random() * (this.nameList.boys.length - 1))],
            size: 28,
            parent: this,
            width: this.stageW * .7,
            height: 50,
            x: this.stageW * .3,
            y: this.stageH * .71 - 25,
            textColor: 0x51362a
        });
        /* name border */
        var nameBorder = ui.Line({
            parent: this,
            sx: this.stageW * .05,
            sy: this.stageH * .71 + 25,
            tx: this.stageW * .95,
            ty: this.stageH * .71 + 25,
            width: 5,
            color: 0x51362a
        });
        /* login button */
        this.login = ui.Button({
            label: "login",
            parent: this,
            width: 120,
            height: 50,
            x: this.stageW * .5 - 60,
            y: this.stageH * .87 - 25,
            skinName: "resource/eui_skins/ButtonInfo.exml"
        });
    };
    /* login listener */
    login.prototype.onLogin = function () {
        if (this.nameInput.text == "please input name") {
            this.control.alert({
                type: "warning",
                text: "please input name"
            });
            return;
        }
        this.control.login({
            name: this.nameInput.text,
            face: this.faceEvent.index
        });
    };
    /* name input listener */
    login.prototype.onInput = function (e) {
        switch (e.type) {
            case "focusIn":
                if (e.target.text.trim() == "please input name")
                    e.target.text = "";
                break;
            case "focusOut":
                if (e.target.text.trim() == "")
                    e.target.text = "please input name";
                else
                    e.target.text = e.target.text.trim();
                break;
        }
    };
    /* stage listener */
    login.prototype.onFace = function (e) {
        var event = this.faceEvent;
        switch (e.type) {
            case "touchBegin":
                event.hold = Math.abs(e.stageY - this.face.y) < 140;
                if (event.hold) {
                    event.startX = e.stageX;
                    event.originX = this.face.x;
                    if (event.animate != undefined) {
                        event.animate.kill();
                        event.animate = undefined;
                    }
                }
                break;
            case "touchMove":
                if (event.hold)
                    this.face.x = event.originX - (event.startX - e.stageX) * 2;
                break;
            case "touchEnd":
                if (event.hold) {
                    var x = this.face.x;
                    var index = Math.round(Math.abs(x) / this.stageW);
                    var max = (this.stageW * 5 + this.stageW * .5);
                    if (x > 0) {
                        this.face.x = Math.min(x, this.stageW);
                        index = 0;
                    }
                    else if (x < -max) {
                        this.face.x = Math.max(x, -max);
                        index = 5;
                    }
                    this.faceIndex = index;
                    this.filter.uniforms.center.x = (e.stageX - this.stageW * .5) / 250 + 0.5;
                    this.filter.uniforms.center.y = (e.stageY - this.stageH * .25 - 125) / 250 + 0.5;
                    this.filterAnimate.invalidate();
                    this.filterAnimate.restart();
                }
                event.hold = false;
                break;
        }
    };
    return login;
}(gameScreen));
__reflect(login.prototype, "login");
//# sourceMappingURL=login.js.map
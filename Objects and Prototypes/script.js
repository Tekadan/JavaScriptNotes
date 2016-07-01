'use strict'; // Throws errors where they should be, alerts of depricated code

///// Basic JavaScript Object Notes

// Object Literal, with two properties 
var dog = {name: 'Oliver', color: 'Brown'}
// Add a new property to our dog object
dog.age = 7;
// Add a function to our dog object
dog.speak = function() { display("Woof woof") }
// To call this function from our object we would say: dog.speak()


////// JavaScript Psuedo Classes

// Constructor function to our object
function Dog() {
    this.name = "Benny"
    this.color = "Golden"
}
// Notice that this function has no return type, and does not return any value but instead applies properties to the 'this' variable.

// Create an instance of a new pseudo class
// - The 'new' keyword creates a new empty object {} that is passed to the dog function where the 'this' keyword will scope to
// - If we were to drop off the 'new' keyword, we are then applying these properties to the browser or the window, the global 'this'.
var dog2 = new Dog();


// Constructor function to our second object with parameters
function Cat(name, color) {
    this.name = name
    this.color = color
}

// var cat = new Cat("Gerry", "Orange");


/////// Object.create Syntax

// Notice how the above two constructor functions accomplish all of this in much fewer lines of code
var cat2 = Object.create(Object.prototype,
{
    name: {
        value: 'Fluffy', 
        enumerable: true,
        writable: true,
        configurable: true
    },
    color: {
        value: 'White',
        enumerable: true,
        writable: true,
        configurable: true
    }
})


/////// ES6 Classes - Another way to Create Classes
class Bird {
    constructor(name, color){
        this.name = name
        this.color = color
    }
    
    speak() {
        display('Chirp Chirp')
    }
}

var bird = new Bird('Reina', 'Yellow');


/////// More on Object Properties
var cat3 = {
    name: { first: 'Fluffy', last: 'LaBeouf'},
    color: 'White'
}

// We can access a property like this:
// display(cat3['color']);
// or like this
// display(cat3.color);
// This allows us to do more powerful things that map complex strings to properties such as
cat3['Eye Color'] = 'Green';

// Properties are more than just a key and a value
// There are three additional values to each property: writable, enumerable, and configurable (Which all default to true)

// Writable means that the property can either be always written to (true) or only once (false)
// to change this value simply
Object.defineProperty(cat3, 'name', {writable: false})
// Now we can no longer write to this property, essentially we have locked it
// If we try and write to this value it will throw an 'TypeError' if we are using 'use strict'

// If the writable property is actually set to an object, what happens? We can change the internal properties to the object
// cat.name.first = "Shia";


///// For... in Loop to Itterate over Properties
for(var propertyName in cat3){
    // display(propertyName + ': ' + cat3[propertyName])
}
Object.defineProperty(cat3, 'name', {enumerable: false});
// The above code will only work if the enumerable to false will do a few things:
// - It will not appear in this for-in loop
// - It will not appear in a JSON Serialization over the wire
// - You can see this property using bracket [] notation
// - It does not appear in the 'keys' for the property

///// Lock Down Properties using Configurable Property
Object.defineProperty(cat3, 'name', {configurable: false});
// This only allows you to change the writable property.
// We can still delete a propety using a property using the delete keyword
delete cat3['Eye Color'];


/////// Getters and Setters
var cat4 = {
    name : {first: 'Fluffy', last: 'LaBeouf'},
    color: 'White'
}

// Attaching a getter and setter to the cat4 object
Object.defineProperty(cat4, 'fullName',
{
    get: function() {
        return this.name.first + ' ' + this.name.last;
    },
    set: function(value){
        var nameParts = value.split(' ');
        this.name.first = nameParts[0];
        this.name.last = nameParts[1];
    }
})

// To call the setter:
cat4.fullName = "Mr. Jingles";



////////// Prototypes and Inheritance
// Nice and simple array
var arr = ['red', 'blue', 'green'];
// Which is short hand for the line below:
var arr2 = new Array('red', 'blue', 'green');


// Get the last element
var last = arr[arr.length-1];
// How do we add the last property so we don't need to call it like this?
Object.defineProperty(arr, 'last', {get: function() {
    return this[this.length - 1];
}})
// Now we added the property to arr, but what if we want to apply it to all arrays?
last = arr.last;

// This means that we have to add it to the Array.prototype
Object.defineProperty(Array.prototype, 'last', {get: function(){
    return this[this.length - 1];
}})
// Now all data of type array should have the 'last' property.

// What is array.prototype? Or Prototypes in general
// Objects do not have a prototype property, but instead a __proto__ property

// A function's prototype is the object instance that will become the prototype for all objects created using this function as a constructor
// A object's prototype is the object instance from which the object is inherited
// Notice that neither of these are classes, but instead they are instances that points to the original prototype

// Now let's work through some examples to really understand what's going on
function Turtle(name, color){
    this.name = name;
    this.color = color;
}

// The line below will display Turtle{}, indicating that this function has a prototype
//display(Turtle.prototype);

// Let's create a new Turtle using this constructor functionm
var squirtle = new Turtle("Squirtle", "Green");

// The line below will display the same thing as display(Turtle.prototype) - and in fact it is pointing to the same exact thing!
// display(squirtle.__proto__)
// Thus: Turtle.prototype === squirtle.__proto__

// Now let's add a property to all Turtles
Turtle.prototype.species = "Musk";

// Now, how does this all work behind the scenes?
// First, if we were to change the age property of squirtle, this means his species will change but the prototyped.species will not change - how? Isn't it a pointer?
squirtle.species = "Florida Softshell";
// We don't actually change the prototype of the object, but instead we added the non-prototyped property to the object.

// Thus, both squirtle would have two species if we actually dug into the code
// display(squirtle.species) -> "Florida Softshell"
// display(squirle.__proto__.species) -> "Musk"
// That is pretty cool - we can see the default value for this property, and also see if it has been changed.
// The key to this, is that squirtle.species is not really set until we do so - otherwise it will search for the __proto__ for this property if the queried property is undefined

// If you were to call the following line:
// display(Object.keys(squirtle))
// You would notice that there is no key for species until we set it diretly on our object, therefore property keys from the __proto__ don't actually show up here

// Big Note: All of what we just talked about with properties also applies to adding functions to objects - as they are considered properties too!

// When something is prototyped it is pointing to a REAL instance in memory, so if the prototype is changed AFTER then the prototype that is pointed to has not changed.
// thus:
var warturtle = new Turtle("Warturtle", "Blue");
Turtle.prototype = {species: "Leather Back"};
var blastoise = new Turtle("Blastoise", "Blue");

// In fact, warturtle will have the species of "Musk" as set by the original prototype
// and Blastoise will have the new species of "Leather Back", as the prototype is recreated in memory as a new pointer, while the old prototype still exists.

//////// Multiple Level Inheritance
// display(squirtle.__proto__.__proto__) will return Object{}
// This is 'walking up the prototype chain'. 
// display(squirtle.__proto__.__proto__.__proto__) will return null
// All objects in javascript inherit from Object, and Object inherits from null.

////// Creating our own Inheritance Chains
// Create the parent class
function Animal(voice) {
    this.voice = voice || 'grunt';
}
// Add the prototype to the parent object
Animal.prototype.speak = function() {
    display(this.voice);
}

function Horse(name, color){
    // Call the parent constructor 
    Animal.call(this, 'Neigh');
    this.name = name;
    this.color = color;
}
// Assign the prototype of the parent object to our child object
Horse.prototype = Object.create(Animal.prototype);
Horse.prototype.constructor = Horse;

var neighy = new Horse('Neighy', 'Red');

// Show that we have properly assigned the constructor
// neighy.speak();

// This will display information about our object
// display(neighy);

// The three keys are as follow to setting up an inheritence chain
// 1. Create the constructor to the child class and call the parent's constructor function name(params)
// 2. Add the set the .prototype function to Object.create(ParentClass.prototype)
// 3. Set the child.prototype.constuctor to it's own constructor method


/////// Approaching Inheritance with Class Like Structure

// Create a static pseudo-parent-class
class Animal2 {
    constructor(voice){
        this.voice = voice || 'grunt';
    }
    
    speak() {
        display(this.voice)
    }
}

// Create our static pseudo-child-class
// extends sets up the inheritence chain
class Fish extends Animal2{
    constructor(name, color){
        // Super calls the parent's constructor
        super('Blub blub blub');
        this.name = name;
        this.color = color;
    }
}

// To show taht we have setup the inheritance correctly we can use some of the display functions
var goldy = new Fish('Goldy', 'Golden');
// goldy.speak(); // Calls the parent's speak() property (or function)
// display(goldy);

// However, the parent class will not pop up in the enummerable key's function.

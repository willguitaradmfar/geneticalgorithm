
var geneticAlgorithmConstructor = require("../index.js")

module.exports = {

	'geneticalgorithm is a function' : function(beforeExit, assert) {
		assert.equal('function', typeof geneticAlgorithmConstructor)
	},

	'constructor creates basic config' : function(beforeExit, assert) {

		var geneticAlgorithm = geneticAlgorithmConstructor( { population : [ {} ] } );

		assert.equal('object' , typeof geneticAlgorithm )
	},

	'complete successfully for evolutions' : function(beforeExit, assert) {

		var config = {
		    mutationFunction: function(phenotype) { return phenotype },
		    crossoverFunction: function(a,b) { return [a,b] },
		    fitnessFunction: function(phenotype) { return 0 },
		    population: [ { name : "bob" } ]
		}
		var geneticalgorithm = geneticAlgorithmConstructor( config )

		geneticalgorithm.evolve()
		assert.equal( "bob" , geneticalgorithm.best().name )
	},



    'solve number evolution' : function(beforeExit, assert) {


		var PhenotypeSize = 5;

		function mutationFunction(phenotype) {
		    var gene = Math.floor( Math.random() * phenotype.numbers.length );
		    phenotype.numbers[gene] += Math.random() * 20 - 10;
		    return phenotype;
		}

		function crossoverFunction(a, b) {
		    function cloneJSON( item ) {
		        return JSON.parse ( JSON.stringify ( item ) )
		    }

		    var x = cloneJSON(a), y = cloneJSON(b), cross = false;

		    for (var i in a.numbers) {
		        if ( Math.random() * a.numbers.length <= 1 ) { cross = !cross }
		        if (cross) {
		            x.numbers[i] = b.numbers[i];
		            y.numbers[i] = a.numbers[i];
		        }
		    }
		    return [ x , y ];
		}

		function fitnessFunction(phenotype) {
		    var sumOfPowers = 0;
		    for (var i in phenotype.numbers) {
		        // assume perfect solution is '50.0' for all numbers
		        sumOfPowers += Math.pow( 50 - phenotype.numbers[i], 2);
		    }
		    return 1 / Math.sqrt(sumOfPowers);
		}

		function createEmptyPhenotype() {
		    var data = [];
		    for (var i = 0; i < PhenotypeSize; i += 1) {
		        data[i] = 0
		    }
		    return { numbers : data }
		}
        var ga = geneticAlgorithmConstructor({
            mutationFunction: mutationFunction,
            crossoverFunction: crossoverFunction,
            fitnessFunction: fitnessFunction,
            population: [ createEmptyPhenotype() ]
        });

        ga.evolve();
        var lastScore = ga.best().score;

        for( var i = 0 ; i < 5 ; i++ ) {
            for( var j = 0 ; j < 5 * PhenotypeSize ; j++ ) ga.evolve()
            assert.equal( true , ga.best().score > lastScore  , i + " " + j + " " + lastScore)
            lastScore = ga.best().score
        }

        assert.equal( true , ga.best().score > 0.5 );
    }
}


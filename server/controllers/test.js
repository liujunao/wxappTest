// oUkCajo6YvQhbxyh0zAiHIet2US8    周胜男
// oUkCajteqKmrvu2c3lNZaBG7gAJ8    无障碍科技
var volunteerOpenIds = [   "oUkCajhHYh4NOH25tXNq95WnhGMk",
			      "oUkCajteqKmrvu2c3lNZaBG7gAJ8",
                              "oUkCajtctotUomFgQaq2D0wUEgCk",
                              "oUkCajpr5S3MjyXN1Ey0Pu95ID_8",
                              "oUkCajh7RzYqZfzyHYVgNXuwRFGc",
                              "oUkCajrAZqlqhW2eFb8D2KHyisQE"
                        ]
var test = [  { openid: 'oUkCajqrSqvJfR5OfMrxblCeQLWE' },
              { openid: 'oUkCajhiio0r24pFLAqQ7D5n7xYE' },
           { openid: 'oUkCajo6YvQhbxyh0zAiHIet2US8' } ]
  var addedForTestOpenIds = [  { openid: "oUkCajo6YvQhbxyh0zAiHIet2US8" },
                               { openid: "oUkCajteqKmrvu2c3lNZaBG7gAJ8" }
                            ]
  addedForTestOpenIds.forEach(function(element) {
      if( test.indexOf(element) === -1 )
      {
          test.push(element)
      }
  });
console.log(test[2]["openid"])
console.log(test)

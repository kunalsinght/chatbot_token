const express = require('express');
const natural = require('natural');
const app = express();

// Use middleware to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Tokenizer function using 'natural'
const tokenizer = new natural.WordTokenizer();

// Home route to take user input
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tokenize and Plot</title>
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f0f2f5;
                    font-family: Arial, sans-serif;
                }
                .container {
                    margin-top: 50px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                #plot {
                    margin-top: 30px;
                    height: 600px;
                }
                .prediction {
                    font-weight: bold;
                    color: #28a745;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>3D Token Plot & Prediction</h1>
                <div class="card p-4 shadow-sm">
                    <form action="/tokenize" method="post" class="form-inline">
                        <div class="form-group">
                            <label for="sentence" class="form-label">Enter a sentence:</label>
                            <input type="text" name="sentence" id="sentence" class="form-control form-control-lg w-100" placeholder="Type a sentence..." required/>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-100 mt-3">Tokenize, Plot and Predict</button>
                    </form>
                </div>
                <div id="plot"></div>
            </div>

            <!-- Plotly.js from CDN -->
            <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
        </body>
        </html>
    `);
});

// Route to handle tokenization and plotting
app.post('/tokenize', (req, res) => {
    const sentence = req.body.sentence;
    const tokens = tokenizer.tokenize(sentence);

    // Create data for 3D plot
    const x = [];
    const y = [];
    const z = [];

    // Generate random data for each token and prepare arrays for plotting
    tokens.forEach((token, index) => {
        x.push(index); // Token index as 'x'
        y.push(token.length);  // Token length as 'y'
        z.push(Math.random() * 10);  // Random 'z' value
    });

    // Calculate the prediction: Average token length as a simple "prediction"
    const avgTokenLength = tokens.reduce((acc, token) => acc + token.length, 0) / tokens.length;
    const predictedTokenLength = avgTokenLength.toFixed(2); // Limit prediction to 2 decimal places

    // Serve the HTML with embedded plot
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tokenize and Plot Result</title>
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f0f2f5;
                    font-family: Arial, sans-serif;
                }
                .container {
                    margin-top: 50px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                #plot {
                    height: 600px;
                    margin-top: 30px;
                }
                .prediction {
                    font-weight: bold;
                    color: #28a745;
                }
                .card {
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>3D Token Plot Result</h1>
                <div class="card p-4 shadow-sm">
                    <p>Tokens: <strong>${tokens.join(', ')}</strong></p>
                    <p class="prediction">Prediction: The predicted next token length is: ${predictedTokenLength} characters</p>
                    <div id="plot"></div>
                </div>
                <a href="/" class="btn btn-primary mt-3">Go Back</a>
            </div>

            <!-- Plotly.js from CDN -->
            <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
            <script>
                const trace = {
                    x: ${JSON.stringify(x)},
                    y: ${JSON.stringify(y)},
                    z: ${JSON.stringify(z)},
                    mode: 'markers+text',  // Display markers and text
                    marker: {
                        size: 12,
                        line: {
                            color: 'rgba(217, 217, 217, 0.14)',
                            width: 0.5
                        },
                        opacity: 0.8
                    },
                    text: ${JSON.stringify(tokens)}, // Labels for each token
                    textposition: 'top center',  // Position of the text relative to the points
                    type: 'scatter3d'
                };

                const layout = {
                    title: '3D Token Plot with Labels',
                    autosize: true,
                    scene: {
                        xaxis: { title: 'Token Index' },
                        yaxis: { title: 'Token Length' },
                        zaxis: { title: 'Random Z' }
                    }
                };

                const data = [trace];
                Plotly.newPlot('plot', data, layout);
            </script>
        </body>
        </html>
    `);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

// ============================================
        // PROMISE CHAINING IMPLEMENTATION
        // ============================================

        /**
         * PROMISE 1: Fetch Posts from API
         * - Simulates a 1000ms delay before fetching
         * - Returns a promise that resolves when data is displayed
         */
        function promiseAPI1() {
            return new Promise((resolve, reject) => {
                // Update status to pending
                updateStatus('posts', 'pending');

                // Simulate network delay of 1000ms
                setTimeout(() => {
                    // Try multiple approaches to fetch the data
                    fetchWithFallback(
                        'https://dummyjson.com/posts',
                        getSamplePosts,
                        displayPostsData
                    )
                    .then(() => {
                        updateStatus('posts', 'completed');
                        resolve(true);
                    })
                    .catch(error => {
                        console.error('Error in promiseAPI1:', error);
                        displayPostsData(getSamplePosts());
                        updateStatus('posts', 'completed');
                        resolve(true);
                    });
                }, 1000); // 1000ms delay
            });
        }

        /**
         * PROMISE 2: Fetch Products from API
         * - Simulates a 2000ms delay before fetching
         * - Returns a promise that resolves when data is displayed
         * - Only called if previous promise resolved
         */
        function promiseAPI2() {
            return new Promise((resolve, reject) => {
                // Update status to pending
                updateStatus('products', 'pending');

                // Simulate network delay of 2000ms
                setTimeout(() => {
                    // Try multiple approaches to fetch the data
                    fetchWithFallback(
                        'https://dummyjson.com/products',
                        getSampleProducts,
                        displayProductsData
                    )
                    .then(() => {
                        updateStatus('products', 'completed');
                        resolve(true);
                    })
                    .catch(error => {
                        console.error('Error in promiseAPI2:', error);
                        displayProductsData(getSampleProducts());
                        updateStatus('products', 'completed');
                        resolve(true);
                    });
                }, 2000); // 2000ms delay
            });
        }

        /**
         * PROMISE 3: Fetch Todos from API
         * - Simulates a 3000ms delay before fetching
         * - Returns a promise that resolves when data is displayed
         * - Only called if previous promises resolved
         */
        function promiseAPI3() {
            return new Promise((resolve, reject) => {
                // Update status to pending
                updateStatus('todos', 'pending');

                // Simulate network delay of 3000ms
                setTimeout(() => {
                    // Try multiple approaches to fetch the data
                    fetchWithFallback(
                        'https://dummyjson.com/todos',
                        getSampleTodos,
                        displayTodosData
                    )
                    .then(() => {
                        updateStatus('todos', 'completed');
                        resolve(true);
                    })
                    .catch(error => {
                        console.error('Error in promiseAPI3:', error);
                        displayTodosData(getSampleTodos());
                        updateStatus('todos', 'completed');
                        resolve(true);
                    });
                }, 3000); // 3000ms delay
            });
        }

        /**
         * Helper function to fetch data with CORS proxy fallback
         * Tries direct fetch first, then uses CORS proxy if needed
         */
        function fetchWithFallback(apiUrl, fallbackFn, displayFn) {
            return new Promise((resolve, reject) => {
                // Try direct fetch first
                fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Determine the data key based on the URL
                    let dataArray = [];
                    if (apiUrl.includes('posts')) {
                        dataArray = data.posts || data;
                    } else if (apiUrl.includes('products')) {
                        dataArray = data.products || data;
                    } else if (apiUrl.includes('todos')) {
                        dataArray = data.todos || data;
                    }
                    
                    displayFn(dataArray);
                    resolve();
                })
                .catch(error => {
                    console.log('Direct fetch failed, trying with CORS proxy...');
                    
                    // Try with CORS proxy
                    const corsProxy = 'https://api.allorigins.win/raw?url=';
                    const encodedUrl = encodeURIComponent(apiUrl);
                    
                    fetch(corsProxy + encodedUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Determine the data key based on the URL
                            let dataArray = [];
                            if (apiUrl.includes('posts')) {
                                dataArray = data.posts || data;
                            } else if (apiUrl.includes('products')) {
                                dataArray = data.products || data;
                            } else if (apiUrl.includes('todos')) {
                                dataArray = data.todos || data;
                            }
                            
                            displayFn(dataArray);
                            resolve();
                        })
                        .catch(error2 => {
                            console.log('CORS proxy also failed, using sample data...');
                            reject(error2);
                        });
                });
            });
        }

        /**
         * Main handler for button click
         * Uses async/await to chain the promises sequentially
         * Each promise only starts when the previous one resolves
         */
        async function handleFetchClick() {
            const btn = document.getElementById('fetchBtn');
            
            // Disable button during fetching
            btn.disabled = true;
            clearMessages();
            clearTables();
            resetStatus();

            try {
                // PROMISE CHAINING LOGIC:
                // Execute promiseAPI1, wait for resolution
                const result1 = await promiseAPI1();
                
                // IF CONDITION: Check if previous promise resolved successfully
                if (result1 === true) {
                    console.log('✓ Posts fetched successfully, proceeding to Products...');
                    
                    // Execute promiseAPI2, wait for resolution
                    const result2 = await promiseAPI2();
                    
                    // IF CONDITION: Check if previous promise resolved successfully
                    if (result2 === true) {
                        console.log('✓ Products fetched successfully, proceeding to Todos...');
                        
                        // Execute promiseAPI3, wait for resolution
                        const result3 = await promiseAPI3();
                        
                        // IF CONDITION: Check if all promises resolved
                        if (result3 === true) {
                            console.log('✓ All data fetched successfully!');
                            showSuccess('✓ All data fetched and displayed successfully!');
                        }
                    }
                }
            } catch (error) {
                console.error('Error in promise chain:', error);
                showError('Error during data fetching. Please try again.');
            } finally {
                // Re-enable button after fetching completes
                btn.disabled = false;
            }
        }

        /**
         * Display Posts data in the table
         * Creates table rows for each post (limited to first 10 items for readability)
         */
        function displayPostsData(posts) {
            const tbody = document.getElementById('postsBody');
            tbody.innerHTML = '';

            // Display first 10 posts for readability
            posts.slice(0, 10).forEach(post => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.body.substring(0, 50)}...</td>
                    <td>${post.userId}</td>
                `;
                tbody.appendChild(row);
            });

            // Show the table
            document.getElementById('postsTableWrapper').classList.add('visible');
        }

        /**
         * Display Products data in the table
         * Creates table rows for each product (limited to first 10 items for readability)
         */
        function displayProductsData(products) {
            const tbody = document.getElementById('productsBody');
            tbody.innerHTML = '';

            // Display first 10 products for readability
            products.slice(0, 10).forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${product.rating.toFixed(1)} ⭐</td>
                `;
                tbody.appendChild(row);
            });

            // Show the table
            document.getElementById('productsTableWrapper').classList.add('visible');
        }

        /**
         * Display Todos data in the table
         * Creates table rows for each todo (limited to first 10 items for readability)
         */
        function displayTodosData(todos) {
            const tbody = document.getElementById('todosBody');
            tbody.innerHTML = '';

            // Display first 10 todos for readability
            todos.slice(0, 10).forEach(todo => {
                const row = document.createElement('tr');
                const status = todo.completed ? '✅ Yes' : '❌ No';
                row.innerHTML = `
                    <td>${todo.id}</td>
                    <td>${todo.todo}</td>
                    <td>${status}</td>
                    <td>${todo.userId}</td>
                `;
                tbody.appendChild(row);
            });

            // Show the table
            document.getElementById('todosTableWrapper').classList.add('visible');
        }

        /**
         * Update the status indicator for each API
         * Changes styling based on pending or completed state
         */
        function updateStatus(apiName, status) {
            const statusElement = document.getElementById(`status-${apiName}`);
            if (statusElement) {
                statusElement.classList.remove('pending', 'completed');
                statusElement.classList.add(status);
            }
        }

        /**
         * Reset all status indicators to initial state
         */
        function resetStatus() {
            document.getElementById('status-posts').classList.remove('pending', 'completed');
            document.getElementById('status-products').classList.remove('pending', 'completed');
            document.getElementById('status-todos').classList.remove('pending', 'completed');
        }

        /**
         * Sample Posts Data - Used as fallback if API fails
         */
        function getSamplePosts() {
            return [
                { id: 1, title: 'His mother had always taught him', body: 'His mother had always taught him not to ever think of himself as better than others. He\'d tried to live by this motto.', userId: 1 },
                { id: 2, title: 'He was an expert but not in a good way', body: 'He was an expert but not in a good way. Everyone hated his books. Their message was incredibly insulting and made no sense.', userId: 5 },
                { id: 3, title: 'It\'s much more important to be wise', body: 'It\'s much more important to be wise than to have a high IQ. Wisdom is about knowing the limits of your knowledge.', userId: 26 },
                { id: 4, title: 'She could not decide', body: 'She could not decide between the two. The choice was not as obvious as it seemed to everyone else. What was the point of the choice?', userId: 3 },
                { id: 5, title: 'The team ran out of time', body: 'The team ran out of time and had to deliver the project without testing it properly. It went out to production and failed immediately.', userId: 11 },
                { id: 6, title: 'He found a leprechaun in his master\'s study', body: 'He found a leprechaun in his master\'s study and was amazed. There were books everywhere and toys. There were also storybooks and encyclopedias.', userId: 2 },
                { id: 7, title: 'The golden retriever loved the leash', body: 'The golden retriever loved the leash more than anything else in the world. She would sit and stare at it for hours, waiting for the next walk.', userId: 4 },
                { id: 8, title: 'The robots didn\'t know what to do', body: 'The robots didn\'t know what to do when the power went out. They stood perfectly still and waited for the electricity to return.', userId: 6 },
                { id: 9, title: 'She had already told him the truth', body: 'She had already told him the truth but he didn\'t believe her. He thought she was just trying to fool him into thinking everything was fine.', userId: 7 },
                { id: 10, title: 'The bridge was almost done', body: 'The bridge was almost done. All it needed was for someone to walk across it. Everyone knew what would happen but they couldn\'t stop it.', userId: 8 }
            ];
        }

        /**
         * Sample Products Data - Used as fallback if API fails
         */
        function getSampleProducts() {
            return [
                { id: 1, title: 'iPhone 9', price: 549, stock: 94, rating: 4.7 },
                { id: 2, title: 'iPhone X', price: 899, stock: 34, rating: 4.8 },
                { id: 3, title: 'Samsung 49-Inch CHG90 144Hz Gaming Monitor', price: 999.99, stock: 7, rating: 4.4 },
                { id: 4, title: 'OPPOF19', price: 280, stock: 123, rating: 4.3 },
                { id: 5, title: 'Huawei P30', price: 400, stock: 50, rating: 4.5 },
                { id: 6, title: 'MacBook Pro', price: 1499, stock: 25, rating: 4.9 },
                { id: 7, title: 'Samsung Galaxy Book', price: 1499, stock: 34, rating: 4.6 },
                { id: 8, title: 'Microsoft Surface Laptop 4', price: 1499, stock: 42, rating: 4.7 },
                { id: 9, title: 'Dell XPS 13', price: 999, stock: 55, rating: 4.5 },
                { id: 10, title: 'iPad Air', price: 599, stock: 68, rating: 4.4 }
            ];
        }

        /**
         * Sample Todos Data - Used as fallback if API fails
         */
        function getSampleTodos() {
            return [
                { id: 1, todo: 'Do some task', completed: false, userId: 26 },
                { id: 2, todo: 'Fix bug in dashboard', completed: false, userId: 26 },
                { id: 3, todo: 'Fix bug in website', completed: false, userId: 26 },
                { id: 4, todo: 'Fix typo in introduction on codeisland.com', completed: false, userId: 26 },
                { id: 5, todo: 'Prepare questions for meeting', completed: true, userId: 26 },
                { id: 6, todo: 'Analyze competitors', completed: false, userId: 26 },
                { id: 7, todo: 'Create Resident Food Checkout PPT for HOC', completed: false, userId: 26 },
                { id: 8, todo: 'Solve system design questions for the interview', completed: true, userId: 26 },
                { id: 9, todo: 'Trim key achievements for Google', completed: false, userId: 26 },
                { id: 10, todo: 'Stand up at meeting (2-3 minutes)', completed: false, userId: 26 }
            ];
        }

        /**
         * Clear all tables
         */
        function clearTables() {
            document.getElementById('postsBody').innerHTML = '';
            document.getElementById('productsBody').innerHTML = '';
            document.getElementById('todosBody').innerHTML = '';
            document.getElementById('postsTableWrapper').classList.remove('visible');
            document.getElementById('productsTableWrapper').classList.remove('visible');
            document.getElementById('todosTableWrapper').classList.remove('visible');
        }

        /**
         * Display error message
         */
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.classList.add('visible');
        }

        /**
         * Display success message
         */
        function showSuccess(message) {
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = message;
            successDiv.classList.add('visible');
        }

        /**
         * Clear all messages
         */
        function clearMessages() {
            document.getElementById('errorMessage').classList.remove('visible');
            document.getElementById('successMessage').classList.remove('visible');
        }
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
function handleRestart() {
    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Restarting...';
    button.disabled = true;

    // Make AJAX call to restart-cron endpoint
    fetch('/restart-cron')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cron jobs restarted successfully!');
                // Refresh cron list after restart
                loadCronList();
            } else {
                alert('Failed to restart cron jobs: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error restarting cron jobs. Please try again.');
        })
        .finally(() => {
            // Reset button state
            button.textContent = originalText;
            button.disabled = false;
        });
}

function loadCronList() {
    const cronListContainer = document.getElementById('cronListContainer');
    cronListContainer.innerHTML = '<div class="text-center">Loading...</div>';

    fetch('/cron-list')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayCronJobs(data.cronJobs);
            } else {
                cronListContainer.innerHTML = '<div class="text-red-500 text-center">Failed to load cron jobs</div>';
            }
        })
        .catch(error => {
            console.error('Error loading cron list:', error);
            cronListContainer.innerHTML = '<div class="text-red-500 text-center">Error loading cron jobs</div>';
        });
}

function displayCronJobs(cronJobsData) {
    const cronListContainer = document.getElementById('cronListContainer');
    
    if (!cronJobsData || Object.keys(cronJobsData).length === 0) {
        cronListContainer.innerHTML = '<div class="text-gray-500 text-center">No active cron jobs found</div>';
        return;
    }

    const sectionsHtml = Object.entries(cronJobsData).map(([fieldNumber, jobs]) => {
        const jobsArray = Array.isArray(jobs) ? jobs : [jobs];
        
        // Separate create_poll and reminder jobs
        const createPollJobs = jobsArray.filter(job => job.type === 'create_poll');
        const reminderJobs = jobsArray.filter(job => job.type === 'reminder');
        
        const jobCardsHtml = createPollJobs.map(job => {
            const nextDate = new Date(job.theNextDayWillSend);
            const formattedDate = nextDate.toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'long'
            });

            // Determine status tag
            const statusTag = job.isCallable 
                ? '<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>'
                : '<span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>';

            return `
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 ml-2 sm:ml-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                        <h4 class="text-sm sm:text-md font-medium text-gray-800">Create Poll</h4>
                        <div class="flex gap-2 self-start">
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${job.type}</span>
                            ${statusTag}
                        </div>
                    </div>
                    
                    <div class="space-y-2 text-xs sm:text-sm">
                        ${job.chatTitle ? `
                            <div class="flex flex-col sm:flex-row sm:items-center">
                                <span class="font-medium text-gray-600 mb-1 sm:mb-0">Chat Title:</span>
                                <span class="text-gray-800 sm:ml-2 break-words">${job.chatTitle}</span>
                            </div>
                        ` : ''}
                        
                        <div class="flex flex-col sm:flex-row sm:items-center">
                            <span class="font-medium text-gray-600 mb-1 sm:mb-0">Chat ID:</span>
                            <span class="text-gray-800 sm:ml-2 break-all font-mono text-xs">${job.chatId}</span>
                        </div>
                        
                        ${job.threadId ? `
                            <div class="flex flex-col sm:flex-row sm:items-center">
                                <span class="font-medium text-gray-600 mb-1 sm:mb-0">Thread ID:</span>
                                <span class="text-gray-800 sm:ml-2 break-all font-mono text-xs">${job.threadId}</span>
                            </div>
                        ` : ''}
                        
                        <div class="flex flex-col sm:flex-row sm:items-center">
                            <span class="font-medium text-gray-600 mb-1 sm:mb-0">Schedule:</span>
                            <span class="text-gray-800 sm:ml-2">${job.description}</span>
                        </div>
                        
                        <div class="flex flex-col">
                            <span class="font-medium text-gray-600 mb-1">Cron Expression:</span>
                            <code class="text-xs bg-white px-2 py-1 rounded border break-all">${job.cronExpression}</code>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-center">
                            <span class="font-medium text-gray-600 mb-1 sm:mb-0">Next Execution:</span>
                            <span class="text-gray-800 sm:ml-2 text-xs sm:text-sm">${formattedDate}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Create reminder tooltips
        const reminderTooltips = reminderJobs.map(job => {
            const nextDate = new Date(job.theNextDayWillSend);
            const formattedDate = nextDate.toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'long'
            });

            const tooltipContent = `
Reminder & Schedule: ${job.description} 
| Next: ${formattedDate}
| Cron: ${job.cronExpression}
            `;
            
            return `
                <span class="reminder-tooltip inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full text-xs font-bold cursor-help ml-2" 
                      title="${tooltipContent}">?</span>
            `;
        }).join('');

        const jobCount = createPollJobs.length;

        return `
            <div class="bg-white rounded-lg shadow-md border border-gray-200 mb-4 mx-2 sm:mx-0">
                <div class="p-3 sm:p-4 border-b border-gray-200">
                    <button onclick="toggleCollapse('field-${fieldNumber}')" 
                            class="w-full flex justify-between items-center text-left focus:outline-none hover:bg-gray-50 p-2 rounded">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                            <div class="bg-yellow-100 border border-yellow-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 sm:mr-3">
                                <span class="text-xs sm:text-sm font-bold text-yellow-800">Badminton Field #${fieldNumber}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-xs sm:text-sm text-gray-600">${jobCount} job${jobCount !== 1 ? 's' : ''}</span>
                                ${reminderTooltips}
                            </div>
                        </div>
                        <svg id="chevron-field-${fieldNumber}" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                <div id="field-${fieldNumber}" class="p-3 sm:p-4 space-y-3">
                    ${jobCardsHtml}
                </div>
            </div>
        `;
    }).join('');

    cronListContainer.innerHTML = sectionsHtml;
}

// eslint-disable-next-line no-unused-vars
function toggleCollapse(elementId) {
    const element = document.getElementById(elementId);
    const chevron = document.getElementById('chevron-' + elementId);
    
    if (element.style.display === 'none') {
        element.style.display = 'block';
        chevron.style.transform = 'rotate(0deg)';
    } else {
        element.style.display = 'none';
        chevron.style.transform = 'rotate(-90deg)';
    }
}

// Load cron list when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCronList();
});
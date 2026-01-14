document.addEventListener('DOMContentLoaded', () => {

    // --- View Counter ---
    const viewsElement = document.getElementById('views');
    let views = localStorage.getItem('profileViews') || 0;
    views = parseInt(views) + 1;
    localStorage.setItem('profileViews', views);
    if (viewsElement) {
        viewsElement.textContent = views;
    }

    // --- Configuration ---

    const DISCORD_USER_ID = '677252221800415252';

    const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;



    // --- Elements ---

    const discordIndicator = document.getElementById('discord-indicator');

    const discordText = document.getElementById('discord-text');

    const music = document.getElementById('music-player');

    const overlay = document.getElementById('enter-overlay');

    const muteBtn = document.getElementById('mute-btn');

    const volumeSlider = document.getElementById('volume-slider');



    // --- 1. Discord Status Logic ---

    async function fetchDiscordStatus() {

        try {

            const response = await fetch(LANYARD_API_URL);

            const { data } = await response.json();

            const status = data.discord_status || 'offline';

           

            const statusMap = {

                online: { text: 'Online', color: '#23a55a' },

                idle: { text: 'Idle', color: '#f0b232' },

                dnd: { text: 'Do Not Disturb', color: '#f23f43' },

                offline: { text: 'Offline', color: '#80848e' },

            };



            const { text, color } = statusMap[status] || statusMap.offline;



            if (discordIndicator && discordText) {

                discordIndicator.style.backgroundColor = color;

                discordIndicator.style.boxShadow = `0 0 8px ${color}`;

                discordText.textContent = `Discord: ${text}`;

            }

        } catch (error) {

            console.error('Discord API Error:', error);

        }

    }



    fetchDiscordStatus();

    setInterval(fetchDiscordStatus, 30000); // Update every 30 seconds



    // --- 2. Overlay & Music Logic ---

    if (overlay) {

        overlay.addEventListener('click', () => {

            if (music) {

                music.volume = 0; // Start at 0 volume

                music.play().then(() => {

                    // Fade in effect

                    const targetVolume = 0.5;

                    const fadeDuration = 3000; // 3 seconds

                    const fadeStep = (targetVolume / fadeDuration) * 50; // Update every 50ms

                    const fadeIn = setInterval(() => {

                        if (music.volume < targetVolume) {

                            music.volume = Math.min(music.volume + fadeStep, targetVolume);

                            if (volumeSlider) volumeSlider.value = music.volume;

                        } else {

                            clearInterval(fadeIn);

                        }

                    }, 50);

                }).catch(err => console.log("Playback error:", err));

            }

            overlay.style.opacity = '0';

            setTimeout(() => overlay.style.display = 'none', 500);

        });

    }



    // --- 3. Music Controls ---

    if (muteBtn && music) {

        muteBtn.addEventListener('click', (e) => {

            e.stopPropagation();

            music.muted = !music.muted;

            muteBtn.textContent = music.muted ? '🔇' : '🔊';

            if (volumeSlider) volumeSlider.style.opacity = music.muted ? '0.3' : '1';

        });

    }

    // --- 4. Tab Visibility Controls ---
    let wasPlaying = false;
    
    document.addEventListener('visibilitychange', () => {
        if (music) {
            if (document.hidden) {
                // Tab is hidden, check if music is playing and pause it
                wasPlaying = !music.paused && music.currentTime > 0;
                if (wasPlaying) {
                    music.pause();
                }
            } else {
                // Tab is visible, resume music if it was playing before
                if (wasPlaying) {
                    music.play().catch(err => console.log("Resume playback error:", err));
                }
            }
        }
    });

    if (volumeSlider && music) {

        volumeSlider.addEventListener('input', (e) => {

            music.volume = e.target.value;

            music.muted = (e.target.value == 0);

            muteBtn.textContent = music.muted ? '🔇' : '🔊';

        });

    }

});
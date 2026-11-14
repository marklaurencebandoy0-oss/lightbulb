document.addEventListener('DOMContentLoaded', () => {

    const body       = document.body;
    const sw         = document.getElementById('switch');
    const soundOn    = document.getElementById('sound_on');     // click when switching on
    const soundStart = document.getElementById('sound_start');  // flicker / warm-up buzz
    const soundOff   = document.getElementById('sound_off');    // click when switching off
    const lightHum   = document.getElementById('light_hum');    // steady hum while lit

    const START_TIME = 1200; // ms, matches light_start.wav and the CSS flicker

    let startTimer = null;
    lightHum.volume = 0.3;

    function play(audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {}); // ignore autoplay-block errors
    }

    function stop(audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    function turnOn() {
        body.classList.add('on');                 // frame 2: warming up
        sw.setAttribute('aria-checked', 'true');
        play(soundOn);                            // sound 1: switch click
        play(soundStart);                         // sound 2: flicker buzz

        startTimer = setTimeout(() => {
            body.classList.add('lit');            // frame 3: fully on
            stop(soundStart);
            play(lightHum);                       // sound 3: steady hum
        }, START_TIME);
    }

    function turnOff() {
        clearTimeout(startTimer);
        body.classList.remove('on', 'lit');       // back to frame 1
        sw.setAttribute('aria-checked', 'false');
        stop(soundStart);
        stop(lightHum);
        play(soundOff);
    }

    function toggleLight() {
        body.classList.contains('on') ? turnOff() : turnOn();
    }

    sw.addEventListener('click', toggleLight);

    sw.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleLight();
        }
    });
});

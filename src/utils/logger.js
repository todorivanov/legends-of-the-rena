let logElement = null;

export class Logger {
  static setLogHolder(el) {
    logElement = typeof el === 'string' ? document.querySelector(el) : el;
    console.log('Logger initialized:', logElement ? 'Found log element' : 'Log element not found');
  }

  static log(message) {
    // Try to find log element if not set
    if (!logElement) {
      logElement = document.querySelector('#log');
    }
    
    if (logElement) {
      logElement.insertAdjacentHTML('beforeend', message);
      // Auto-scroll to bottom
      logElement.scrollTop = logElement.scrollHeight;
    } else {
      console.warn('Log element not found, message:', message);
    }
  }

  static logFighter(obj, el) {
    const msg = `
      <div class="details-holder" data-id="${obj.id}" draggable="true">
        <div class="row">
          <div class="col-2">
            <div class="img"><img src="${obj.image}" alt="${obj.name}"></div>
          </div>
          <div class="col-9">
            <div class="name"><strong>Name:</strong> ${obj.name}</div>
            <div class="health"><strong>Health:</strong> ${obj.health}</div>
            <div class="strength"><strong>Strength:</strong> ${obj.strength}</div>
            <div class="descr"><strong>Bio:</strong> ${obj.description}</div>
          </div>
        </div>               
      </div>
    `;

    if (el) {
      const element = typeof el === 'string' ? document.querySelector(el) : el;
      if (element) {
        element.insertAdjacentHTML('beforeend', msg);
      }
    } else {
      this.log(msg);
    }
  }

  static logTeam(team, el) {
    const msg = `<div class="team-holder ${team.id}"></div>`;

    if (el) {
      const element = typeof el === 'string' ? document.querySelector(el) : el;
      if (element) {
        element.insertAdjacentHTML('beforeend', msg);
      }
    } else {
      this.log(msg);
    }

    const teamHolder = document.querySelector(`.${team.id}`);
    for (const fighter of team.fighters) {
      this.logFighter(fighter, teamHolder);
    }
  }

  static newLine() {
    if (logElement) {
      logElement.insertAdjacentHTML('beforeend', '<br>');
    }
  }

  static clearLog() {
    if (logElement) {
      logElement.innerHTML = '';
    }
  }
}

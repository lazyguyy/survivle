function make_list_item(label, percent, bar_text) {
    var li = document.createElement("li");
    li.className = "chart-item";
    li.innerHTML = `<div class="bar-label">${label}</div><div style="max-width: ${percent}%" class="bar">${bar_text}</div>`;
    return li;
}

class StatsHandler {
    constructor(root_element, stats_summary, storage_name = "results") {
        this.storage_name = storage_name;
        this.stats_summary = stats_summary;
        let values = localStorage.getItem(storage_name);
        if (values == null) {
            values = [0,0,0,0,0,0,0];
            localStorage.setItem(storage_name, JSON.stringify(values));
        } else {
            values = JSON.parse(values)
        }
        this.values = values;
        this.updateUIStats()
        this.bar_chart = new BarChart(root_element, [...values.keys()].map(x => x+1), values)
    }

    updateUIStats() {
        let games_played = this.values.reduce((a, b) => a + b, 0);
        if (games_played == 0)
            return;
        this.stats_summary.style["display"] = "inline";
        let won_games = this.values.slice(6).reduce((a, b) => a + b, 0)
        let total_guesses = [...this.values.keys()].map(x => (x + 1) * this.values[x]).reduce((a, b) => a+ b, 0);
        this.stats_summary.children[0].innerText = Math.round(total_guesses * 100 / games_played) / 100
        this.stats_summary.children[1].innerText = `${Math.round(won_games * 10000 / games_played) / 100}%`
        console.log(won_games, games_played, total_guesses);
    }

    updateResults(turns_taken) {
        while (this.values.length < turns_taken) {
            this.values.push(0);
            this.bar_chart.updateValue(this.values.length, 0)
        }
        this.values[turns_taken - 1] += 1;
        console.log(this.values);
        localStorage.setItem(this.storage_name, JSON.stringify(this.values));
        this.updateUIStats();
        this.bar_chart.updateValue(turns_taken, this.values[turns_taken - 1]);
    }

}

class BarChart{
    // root_element should be of type ul
    constructor(root_element, labels=[], values=[]) {
        this.root = root_element;
        this.labels = labels;
        this.values = [...values];
        this.max_bar_length = 1;
        this.createBars()
    }

    updateHtml(label_index) {
        var child = this.root.children[label_index];
        var percent = this.values[label_index] * 100 / this.max_value;
        child.children[1].style["max-width"] = `${percent}%`;
        child.children[1].innerText = this.values[label_index];
    }

    updateValue(label_name, new_value) {
        console.log(this.labels)
        console.log(label_name)
        if (label_name in this.label_mapping) {
            let label_index = this.label_mapping[label_name]
            this.values[label_index] = new_value;
            this.updateHtml(label_index)
        } else {
            this.label_mapping[label_name] = this.labels.length
            this.labels.push(label_name);
            this.values.push(new_value);
            var bar_percent = this.max_value == 0 ? 0 : (new_value * 100 / this.max_value) * this.max_bar_length;
            var li = make_list_item(label_name, bar_percent, new_value);
            this.root.appendChild(li);
        }
        if (new_value > this.max_value) {
            this.max_value = new_value;
            for (var i = 0; i < this.root.children.length; i++) {
                this.updateHtml(i)
            }
        }
    }

    clear() {
        for (let i = root.children.length; i >= 0; i--) {
            root.children[i].remove()
        }
        this.values = []
        this.labels = []
        this.max_value = 0
    }

    createBars() {
        this.label_mapping = Object.fromEntries([...this.labels.keys()].map(i => [this.labels[i], i]));
        this.max_value = Math.max(...this.values);
        for (var i = 0; i < this.labels.length; i++) {
            var bar_percent = this.max_value == 0 ? 0 : (this.values[i] * 100 / this.max_value) * this.max_bar_length;
            var li = make_list_item(this.labels[i], bar_percent, this.values[i]);
            this.root.appendChild(li);
        }
    }
}

export {StatsHandler}

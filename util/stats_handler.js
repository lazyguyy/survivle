function make_list_item(label, percent, bar_text) {
    var li = document.createElement("li");
    li.className = "chart-item";
    li.innerHTML = `<div class="bar-label">${label}</div><div style="max-width: ${percent}%" class="bar">${bar_text}</div>`;
    return li;
}

class StatsHandler {
    constructor(root_element, storage_name = "results") {
        this.storage_name = storage_name;
        let values = localStorage.getItem(storage_name);
        if (values == null) {
            values = [0,0,0,0,0,0,0];
            localStorage.setItem(storage_name, JSON.stringify(values));
        } else {
            values = JSON.parse(values)
        }
        this.bar_chart = new BarChart(root_element, [...values.keys()].map(x => x+1), values)
    }

    updateResults(turns_taken) {
        while (values.length < turns_taken) {
            values.push(0);
            this.bar_chart.updateValue(values.length, 0)
        }
        values[turns_taken - 1] += 1;
        localStorage.setItem(this.storage_name, JSON.stringify(values));
        this.bar_chart.updateValue(turns_taken, values[turns_taken - 1]);
    }
}

class BarChart{
    // root_element should be of type ul
    constructor(root_element, labels=[], values=[]) {
        this.root = root_element;
        this.labels = labels;
        this.values = values;
        this.createBars()
    }

    updateValue(label_name, new_value) {
        console.log(label_name, new_value);
        if (label_name in this.label_mapping) {
            this.values[this.label_mapping[label_name]] = new_value;
        } else {
            this.labels.push(label_name);
            this.values.push(new_value);
            var bar_percent = this.max_value == 0 ? 100 : (new_value * 100 / this.max_value)
            var li = make_list_item(label_name, bar_percent, new_value);
            this.root.appendChild(li);
        }
        if (new_value > this.max_value) {
            this.max_value = new_value;
            for (var i = 0; i < this.root.children.length; i++) {
                var child = this.root.children[i];
                var percent = this.values[i] * 100 / this.max_value;
                child.children[1].style["max-width"] = `${percent}%`;
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
            var bar_percent = this.max_value == 0 ? 100 : (this.values[i] * 100 / this.max_value)
            var li = make_list_item(this.labels[i], bar_percent, this.values[i]);
            this.root.appendChild(li);
        }
    }
}

export {StatsHandler}

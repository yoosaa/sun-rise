export function disp() {

    return new Promise((resolve, reject) => {

        let elem = document.getElementById("akeome");
        let text = document.getElementById("akeome").innerHTML;
        console.log(text);

        let text_array = text.split('');
        let append_elem = '';

        for (let i = 0; i < text_array.length; i++) {
            append_elem += `<span class="display_${i}">${text_array[i]}</span>`;
        }

        elem.innerHTML = append_elem;


    });
}
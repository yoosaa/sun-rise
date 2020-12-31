require('jquery');


export function disp() {

    return new Promise((resolve, reject) => {

        let $elem = $("#akeome");
        let $text = $("#akeome").html();

        let text_array = $text.split('');
        let append_elem = '';

        for (let i = 0; i < text_array.length; i++) {
            append_elem += `<span class="display_${i}">${text_array[i]}</span>`;
        }

        $elem.html(append_elem);
        console.log(append_elem);

        for (let i = 0; i<text_array.length; i++){

            $(".display_" + i).animate({
                "opacity": 1
            }, (i + 1) * 2000);

        }

    });
}
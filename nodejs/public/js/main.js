$(document).ready(function() {
    $('.alert').hide();

    var goat_modal = $('#goat-modal').on('shown.bs.modal', function() {
        clearTimeout(goat_modal.data('hideInterval'));
        var id = setTimeout(function(){
            goat_modal.modal('hide');
        }, 2500);
        goat_modal.data('hideInterval', id);
    });
});

function BrewClick() {
    console.log('Brewing...');
    $.get('/send/vera/pressbutton?params=7'); 
}

function OffClick() {
    console.log('Turning off...');
    $.get('/send/vera/pressbutton?params=8');
}

function Connect() {
    console.log('Connecting Vera...');
    $.ajax({
        url: 'http://localhost:1337',
        data: {comm: 'connect'}
    });
}
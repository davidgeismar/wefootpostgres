

function countUp(count,elem)
{
    var $display = $(elem);
    var run_count = 0;
    var speed = 5000/count;
    var int = setInterval(function() {
        if(run_count <= count){
            $display.text(run_count);
            run_count++;
        }
        else {
            clearInterval(int);
        }
    }, speed);
}
countUp(parseInt($('.count').attr('data-value')),'.count');

countUp(parseInt($('.count2').attr('data-value')),'.count2');

countUp(parseInt($('.count3').attr('data-value')),'.count3');

countUp(parseInt($('.count4').attr('data-value')),'.count4');

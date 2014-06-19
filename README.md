<p>banner轮播是最常见的web交互动画效果之一，之前也写过各种不同的效果，但都没实现模块化。这次花了点时间，结合之前的各个版本，做了一个统一的组件。以下就对这个组件做个简短的介绍，并附上DEMO。</p>
<h4 class="mt20">功能特点</h4>
<ul>
    <li>可控方向，支持四个方向的滑动（上下或左右）</li>
    <li>支持触屏划动事件</li>
    <li>可自定义轮播内容，不仅限与图片，后面有更详情介绍</li>
    <li>模块化，可分享数据层，</li>
</ul>
<h4 class="mt20">文件引用</h4>
<div class="box1">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<br />
    <script src="/Admin/News/edit/id/carousel.js" type="text/javascript"></script>
</div>
<h4 class="mt20">DOM结构</h4>
<p>看过一些其他同学写的组件，很多都会在组件内直接生成DOM结构及style样式，这样模块化更明显，使用都只需要关注如何调用就可以了。但是缺点就是结构已经固定死，不太灵活。我希望的是组件能够解决更多的需求，不过，相对来说，使用起来也会变得麻烦些。</p>
<pre class="brush:html;">
&lt;div id="demo"&gt; //最外层容器
    &lt;a href="javascript:void(0)" class="prev"&gt;前翻&lt;/a&gt;   
    &lt;div class="demoMain"&gt;
        &lt;ul class="clearfix"&gt;
            //具体的结构
        &lt;/ul&gt;
    &lt;/div&gt;
    &lt;a href="javascript:void(0)" class="next"&gt;后翻&lt;/a&gt;
    &lt;p class="demoList"&gt;&lt;span class="selected"&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;/p&gt;    //列表
&lt;/div&gt;
</pre> 
<p>以上结构为最基础的一个轮播结构，但不仅限与如此。你可以把翻页按钮、列表状态随意放到页面的任何一个位置,轮播的具体内容，也可以通过改变调用参数，变成任何内容。通过后续的调用方法和DEMO，你就会了解我为什么这么说了。<b>有一点需要注意一下，就是需要轮播的DOM必须使用ul,li包裹。</b></p>
<h4 class="mt20">css控制</h4>
<p>css样式就不举例了，因为该组件对样式真心没固定的写法。</p>
<h4 class="mt20">实例化</h4>
<p>实例化时需要传入一个JSON数据，用来控制组件的运行，例：</p>
<pre class="brush:javascript;">    var banner=new carousel({
            "data":[{"img":"./images/banner1.jpg"},{"img":"./images/banner2.jpg"},{"img":"./images/banner3.jpg"}],
            "tpl":"<li style="\&quot;background-image:url({%s})\&quot;"></li>
",
            "order":["img"],
            "dir":"left",
            "next":"#banner a.next",
            "prev":"#banner a.prev",
            "main":"#banner div.bannerMain",
            "list":"#banner p.bannerList",
            "time":3000,
            "moveVal":1920,
            "res":true,
            "auto":false
        });</pre> <p>JSON的各个KEY说明如下：</p>
<table class="ke-zeroborder">
    <tbody><tr>
        <th>KEY</th>
<th>参数说明</th>
<th>是否必须</th>
<th>默认</th>
    </tr>
    <tr>
        <td>data</td>
        <td>轮播的数据数组，需要结合“tpl”、“order”参数组合使用。有该参数时，组件就会通过把tpl中的"{%s}"字串替换成数据而最后生成需要轮播的内容<br />
如上面案例中，data的值是key只有一个img的3个一级JSON数据，相应的tpl中“{%s%}”只出现一个，结合order，组件会把data的各项值分别替换tpl的各个"{%s%}"字串。<br />
        该参数剥离的数据层，可以让轮播内容延迟加载。让页面更快的展示在用户面前。
        </td>
        <td>否</td>
        <td>无</td>
    </tr>
    <tr>
        <td>tpl</td>
        <td>轮播内容的模版，单个轮播DOM的具体结构，需要填充的数据用"{%s%}"表示。</td>
        <td>有data值时必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>order</td>
        <td>轮播内容的输出顺序，数据类型为数组。数组值与data中的key对应，用来控制data中的数据输出在tpl中的第几个"{%s}"中。</td>
        <td>有data值时必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>dir</td>
        <td>轮播方向。值为"left"时为左右轮播，"top"时为上下轮播</td>
        <td>否</td>
        <td>left</td>
    </tr>
    <tr>
        <td>next</td>
        <td>控制后翻的DOM，用jquery选择器的写法传入</td>
        <td>必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>prev</td>
        <td>控制前翻的DOM，用jquery选择器的写法传入</td>
        <td>必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>main</td>
        <td>轮播的外层DOM，通常为ul的外层。</td>
        <td>必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>list</td>
        <td>轮播列表的DOM，用来控制及查看当前轮播状态</td>
        <td>必须</td>
        <td>无</td>
    </tr>
    <tr>
        <td>time</td>
        <td>自动轮播时间间隔</td>
        <td>需要开启自动时必须</td>
        <td>2秒</td>
    </tr>
    <tr>
        <td>moveVal</td>
        <td>轮播时的移动距离，单位px</td>
        <td>必须</td>
        <td>单个轮播对象的长宽值。dir为left时为宽，top时为高</td>
    </tr>
    <tr>
        <td>res</td>
        <td>true或false。用于控制是否需要自适应外容器（也就是main），一般用于轮播区域不固定，如满屏时使用。</td>
        <td>否</td>
        <td>false</td>
    </tr>
    <tr>
        <td>auto</td>
        <td>true或false，用于控制是否需要自动轮播</td>
        <td>否</td>
        <td>true</td>
    </tr>
</tbody>
</table>
<h4 class="mt20">优化方向</h4>
<ul>
    <li>加入轮播后执行回调的功能，可以解决一些单个轮播动画中还有子动画的需求。通过执行回调，可以在轮播后执行子动画</li>
    <li>不同的动画交互方式，比如渐隐</li>
    <li>……</li>
</ul>
<p>更多的优化方向，需要各位同学提出各种千奇百怪的需求。</p>

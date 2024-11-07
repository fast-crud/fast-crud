<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'

const {Layout} = DefaultTheme

function goAskAi() {
  window.open("https://ai.handsfree.work/#/chat?productKey=repo_gpt-3.5-turbo")
}
</script>

<template>
  <Layout>
<!--    <template #nav-bar-content-before>-->
<!--      <div class="ask-ai">-->
<!--        <button type="button" class="DocSearch DocSearch-Button" aria-label="Ask AI">-->
<!--          <span class="DocSearch-Button-Container" @click="goAskAi">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor"-->
<!--                                                                                                     d="M11 4c.649 0 1.25.206 1.741.556c-1.292.673-2.48 1.52-3.741 2.248l1 1.732c1.575-.91 3.052-2.05 4.76-2.706a3.001 3.001 0 0 1 4.057 3.09C17.588 8.137 16.26 7.531 15 6.804l-1 1.732c1.575.91 3.302 1.618 4.723 2.77a3.001 3.001 0 0 1-.648 5.058C18.14 14.908 18 13.455 18 12h-2c0 1.818.25 3.668-.037 5.476a3.001 3.001 0 0 1-4.705 1.967c1.293-.673 2.482-1.52 3.742-2.247l-1-1.732c-1.575.91-3.052 2.05-4.76 2.706a3.001 3.001 0 0 1-4.057-3.09c1.23.782 2.557 1.388 3.817 2.116l1-1.732c-1.575-.91-3.302-1.618-4.724-2.77a3.001 3.001 0 0 1 .649-5.058C5.86 9.092 6 10.545 6 12h2c0-1.818-.25-3.669.037-5.476A3.001 3.001 0 0 1 11 4Zm3.793-.258a5.001 5.001 0 0 0-8.548 1.71a5.001 5.001 0 0 0-2.793 8.258a5.001 5.001 0 0 0 5.756 6.548a5.001 5.001 0 0 0 8.548-1.71a5.001 5.001 0 0 0 2.793-8.258a5.001 5.001 0 0 0-5.756-6.548Z"/></svg>-->
<!--            <span class="DocSearch-Button-Placeholder">Ask AI</span>-->
<!--          </span>-->
<!--          <a class="intro" href="/guide/other/helper.html">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">-->
<!--              <path fill="currentColor"-->
<!--                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm-1-5h2v2h-2v-2Zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355Z"/>-->
<!--            </svg>-->
<!--          </a>-->
<!--        </button>-->
<!--      </div>-->
<!--    </template>-->
  </Layout>
</template>

<style lang="less">
.ask-ai {
  margin-left: 20px;
  .DocSearch{
    cursor: auto;
  }
  .DocSearch-Button-Placeholder {
    margin-left: 10px;
  }
  .DocSearch-Button-Container{
    cursor: pointer;
  }
  .intro {
    cursor: pointer;
    font-size: 12px;
    color: #bdb5b5
  }
}

</style>